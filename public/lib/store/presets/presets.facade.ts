import { arrayAdd, PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { SearchParams } from '@redactie/utils';
import { move } from 'ramda';
import { from, Observable } from 'rxjs';

import { showAlert } from '../../helpers';
import {
	CreatePresetPayload,
	PresetDetailResponse,
	presetsApiService,
	PresetsApiService,
	UpdatePresetPayload,
} from '../../services/presets';

import {
	PresetDetailFieldModel,
	PresetDetailModel,
	PresetDetailUIModel,
	presetsDetailQuery,
	PresetsDetailQuery,
	presetsDetailStore,
	PresetsDetailStore,
} from './detail';
import {
	PresetListModel,
	presetsListPaginator,
	PresetsListQuery,
	presetsListQuery,
	PresetsListState,
	PresetsListStore,
	presetsListStore,
} from './list';
import { getAlertMessages } from './presets.alertMessages';
import { PRESETS_ALERT_CONTAINER_IDS } from './presets.const';
import {
	CreatePresetPayloadOptions,
	GetPresetPayloadOptions,
	GetPresetsPaginatedPayloadOptions,
	GetPresetsPayloadOptions,
	UpdatePresetPayloadOptions,
} from './presets.types';

export class PresetsFacade {
	constructor(
		protected listStore: PresetsListStore,
		protected listQuery: PresetsListQuery,
		public listPaginator: PaginatorPlugin<PresetsListState>,
		protected detailStore: PresetsDetailStore,
		protected detailQuery: PresetsDetailQuery,
		protected service: PresetsApiService
	) {}

	// LIST STATES
	public readonly presets$ = this.listQuery.presets$;
	public readonly listError$ = this.listQuery.error$;
	public readonly isFetching$ = this.listQuery.isFetching$;
	public readonly UIState$ = this.listQuery.selectUIState();
	public setIsFetching(isFetching = false): void {
		this.listStore.setIsFetching(isFetching);
	}
	public getIsFetching(): boolean {
		return this.listQuery.getIsFetching();
	}

	// DETAIL STATES
	public readonly isCreating$ = this.detailQuery.isCreating$;
	public readonly activePreset$ = this.detailQuery.selectActive<
		PresetDetailModel
	>() as Observable<PresetDetailModel>;
	public readonly activePresetUI$ = this.detailQuery.ui.selectActive<
		PresetDetailUIModel
	>() as Observable<PresetDetailUIModel>;

	public selectPresetUIState(presetId: string): Observable<PresetDetailUIModel> {
		return this.detailQuery.ui.selectEntity(presetId);
	}

	public selectPreset(presetId: string): Observable<PresetDetailModel> {
		return this.detailQuery.selectEntity(presetId);
	}

	// LIST FUNCTIONS
	public getPresetsPaginated(
		searchParams: SearchParams,
		options?: GetPresetsPaginatedPayloadOptions
	): Observable<PaginationResponse<PresetListModel>> {
		const defaultOptions = {
			alertContainerId: PRESETS_ALERT_CONTAINER_IDS.fetch,
			clearCache: false,
		};
		const serviceOptions = {
			...defaultOptions,
			...options,
		};
		if (serviceOptions.clearCache) {
			this.listPaginator.clearCache();
		}
		const alertMessages = getAlertMessages();

		return from(
			this.service
				.getPresets(searchParams)
				.then(response => {
					const paging = response._page;

					this.listStore.update({
						paging,
						error: null,
					});

					return {
						perPage: paging.size,
						currentPage: presetsListPaginator.currentPage,
						lastPage: paging.totalPages,
						total: paging.totalElements,
						data: response?._embedded,
					};
				})
				.catch(error => {
					showAlert(serviceOptions.alertContainerId, 'error', alertMessages.fetch.error);
					this.listStore.update({
						error,
						isFetching: false,
					});
					throw error;
				})
		);
	}

	public getPresets(searchParams?: SearchParams, options?: GetPresetsPayloadOptions): void {
		const defaultOptions: GetPresetsPayloadOptions = {
			alertContainerId: PRESETS_ALERT_CONTAINER_IDS.fetch,
		};
		const serviceOptions = {
			...defaultOptions,
			...options,
		};
		const { isFetching } = this.listQuery.getValue();

		if (isFetching) {
			return;
		}
		const alertMessages = getAlertMessages();
		this.listStore.setIsFetching(true);

		this.service
			.getPresets(searchParams)
			.then(response => {
				if (response) {
					this.listStore.set(response._embedded);
					this.listStore.update({
						error: false,
						isFetching: false,
					});
				}
			})
			.catch(error => {
				showAlert(serviceOptions.alertContainerId, 'error', alertMessages.fetch.error);
				this.listStore.update({
					isFetching: false,
					error,
				});
			});
	}

	// DETAIL FUNCTIONS
	public setActivePreset(presetId: string): void {
		this.detailStore.setActive(presetId);
		this.detailStore.ui.setActive(presetId);
	}

	public removeActivePreset(): void {
		this.detailStore.setActive(null);
		this.detailStore.ui.setActive(null);
	}

	public hasActivePreset(presetId: string): boolean {
		return this.detailQuery.hasActive(presetId);
	}

	public hasPreset(presetId: string): boolean {
		return this.detailQuery.hasEntity(presetId);
	}

	public resetDetailStore(): void {
		this.detailStore.reset();
	}

	public createPreset(
		payload: CreatePresetPayload,
		options: CreatePresetPayloadOptions = {
			successAlertContainerId: PRESETS_ALERT_CONTAINER_IDS.create,
			errorAlertContainerId: PRESETS_ALERT_CONTAINER_IDS.create,
		}
	): Promise<PresetDetailResponse | void> {
		this.detailStore.setIsCreating(true);
		const alertMessages = getAlertMessages(payload.data.name);

		return this.service
			.createPreset(payload)
			.then(preset => {
				this.detailStore.update({
					isCreating: false,
					error: null,
				});
				this.detailStore.upsert(preset.uuid, preset);
				this.listPaginator.clearCache();

				// Timeout because the alert is visible on the edit page
				// and not on the create page
				setTimeout(() => {
					showAlert(
						options.successAlertContainerId,
						'success',
						alertMessages.create.success
					);
				}, 300);
				return preset;
			})
			.catch(error => {
				showAlert(options.errorAlertContainerId, 'error', alertMessages.create.error);
				this.detailStore.update({
					isCreating: false,
					error,
				});
			});
	}

	public updatePreset(
		payload: UpdatePresetPayload,
		options: UpdatePresetPayloadOptions = {
			alertContainerId: PRESETS_ALERT_CONTAINER_IDS.update,
		}
	): Promise<PresetDetailResponse | void> {
		this.detailStore.setIsUpdatingEntity(true, payload.uuid);
		const alertMessages = getAlertMessages(payload.body.data.label);

		return this.service
			.updatePreset(payload)
			.then(preset => {
				this.detailStore.ui.update(payload.uuid, {
					isUpdating: false,
					error: null,
				});
				this.detailStore.upsert(preset.uuid, preset);
				// update item in list?
				this.listPaginator.clearCache();
				showAlert(options.alertContainerId, 'success', alertMessages.update.success);
				return preset;
			})
			.catch(error => {
				showAlert(options.alertContainerId, 'error', alertMessages.update.error);
				this.detailStore.ui.update(payload.uuid, {
					isUpdating: false,
					error,
				});
			});
	}

	public activatePreset(presetId: string): Promise<void> {
		this.detailStore.ui.update(presetId, { isActivating: true });
		return this.service
			.activate(presetId)
			.then(() => {
				this.detailStore.update(presetId, preset => ({
					meta: {
						...preset.meta,
						active: true,
					},
				}));
				this.detailStore.ui.update(presetId, { isActivating: false, error: null });
				this.listPaginator.clearCache();
			})
			.catch(error => {
				this.detailStore.ui.update(presetId, { isActivating: false, error });
			});
	}

	public deactivatePreset(presetId: string): Promise<void> {
		this.detailStore.ui.update(presetId, { isActivating: true });
		return this.service
			.deactivate(presetId)
			.then(() => {
				this.detailStore.update(presetId, preset => ({
					meta: {
						...preset.meta,
						active: false,
					},
				}));
				this.detailStore.ui.update(presetId, { isActivating: false, error: null });
				this.listPaginator.clearCache();
			})
			.catch(error => {
				this.detailStore.ui.update(presetId, { isActivating: false, error });
			});
	}

	public getPreset(
		presetId: string,
		searchParams?: SearchParams,
		options?: GetPresetPayloadOptions
	): Promise<void> {
		const defaultOptions = {
			alertContainerId: PRESETS_ALERT_CONTAINER_IDS.fetchOne,
			force: false,
		};
		const serviceOptions = {
			...defaultOptions,
			...options,
		};
		if (this.detailQuery.hasEntity(presetId) && !serviceOptions.force) {
			return Promise.resolve();
		}
		const alertMessages = getAlertMessages();
		this.detailStore.setIsFetchingEntity(true, presetId);
		return this.service
			.getPreset(presetId, searchParams)
			.then(response => {
				this.detailStore.upsert(response.uuid, response);
				this.detailStore.ui.upsert(response.uuid, { error: null, isFetching: false });
			})
			.catch(error => {
				showAlert(serviceOptions.alertContainerId, 'error', alertMessages.fetchOne.error);
				this.detailStore.ui.upsert(presetId, {
					error,
					isFetching: false,
				});
			});
	}

	public addField(presetId: string, field: PresetDetailFieldModel): void {
		this.detailStore.update(presetId, state => ({
			data: {
				...state.data,
				fields: arrayAdd(state.data.fields, {
					field,
					formSchema: {
						fields: [],
					},
					validators: [],
				}),
			},
		}));
	}

	public updateField(presetId: string, field: PresetDetailFieldModel): void {
		this.detailStore.update(presetId, state => ({
			data: {
				...state.data,
				fields: state.data.fields.map(f => {
					return f.field.uuid === field.uuid
						? {
								...f,
								field,
						  }
						: f;
				}),
			},
		}));
	}

	public moveField(presetId: string, fromIndex: number, toIndex: number): void {
		this.detailStore.update(presetId, state => ({
			...state,
			data: {
				...state.data,
				fields: move(fromIndex, toIndex, state.data.fields),
			},
		}));
	}

	public deleteField(presetId: string, fieldId: string): void {
		this.detailStore.update(presetId, state => ({
			data: {
				...state.data,
				fields: state.data.fields.filter(f => f.field.uuid !== fieldId),
			},
		}));
	}
}

export const presetsFacade = new PresetsFacade(
	presetsListStore,
	presetsListQuery,
	presetsListPaginator,
	presetsDetailStore,
	presetsDetailQuery,
	presetsApiService
);
