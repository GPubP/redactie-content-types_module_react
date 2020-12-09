import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { SearchParams } from '@redactie/utils';
import { from, Observable } from 'rxjs';

import { showAlert } from '../../helpers';
import {
	CreatePresetPayload,
	PresetDetail,
	presetsApiService,
	PresetsApiService,
	UpdatePresetPayload,
} from '../../services/presets';

import {
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
	PresetUIModel,
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
	public setIsFetching(isFetching = false): void {
		this.listStore.setIsFetching(isFetching);
	}
	public selectUIState(): Observable<PresetUIModel> {
		return this.listQuery.selectUIState();
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
					const paging = response.paging;

					this.listStore.update({
						paging,
						error: null,
					});

					return {
						perPage: paging.limit,
						currentPage: presetsListPaginator.currentPage,
						lastPage: paging.total / paging.limit,
						total: paging.total,
						data: response.data,
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
					this.listStore.set(response.data);
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
	public setActiveDetail(presetId: string): void {
		this.detailStore.setActive(presetId);
		this.detailStore.ui.setActive(presetId);
	}

	public removeActiveDetail(): void {
		this.detailStore.setActive(null);
		this.detailStore.ui.setActive(null);
	}

	public hasActiveDetail(presetId: string): boolean {
		return this.detailQuery.hasActive(presetId);
	}

	public createPreset(
		payload: CreatePresetPayload,
		options: CreatePresetPayloadOptions = {
			alertContainerId: PRESETS_ALERT_CONTAINER_IDS.create,
		}
	): Promise<PresetDetail | void> {
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
				showAlert(options.alertContainerId, 'success', alertMessages.create.success);
				return preset;
			})
			.catch(error => {
				showAlert(options.alertContainerId, 'error', alertMessages.create.error);
				this.detailStore.update({
					isCreating: false,
					error,
				});
			});
	}

	public updatePreset(
		payload: UpdatePresetPayload,
		options: UpdatePresetPayloadOptions = {
			alertContainerId: PRESETS_ALERT_CONTAINER_IDS.create,
		}
	): Promise<PresetDetail | void> {
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
			.then(error => {
				showAlert(options.alertContainerId, 'error', alertMessages.update.error);
				this.detailStore.ui.update(payload.uuid, {
					isUpdating: false,
					error,
				});
			});
	}

	public getPreset(presetId: string, options?: GetPresetPayloadOptions): void {
		const defaultOptions = {
			alertContainerId: PRESETS_ALERT_CONTAINER_IDS.fetchOne,
			force: false,
		};
		const serviceOptions = {
			...defaultOptions,
			...options,
		};
		if (this.detailQuery.hasEntity(presetId) && !serviceOptions.force) {
			return;
		}
		const alertMessages = getAlertMessages();
		this.detailStore.setIsFetchingEntity(true, presetId);
		this.service
			.getPreset(presetId)
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
}

export const presetsFacade = new PresetsFacade(
	presetsListStore,
	presetsListQuery,
	presetsListPaginator,
	presetsDetailStore,
	presetsDetailQuery,
	presetsApiService
);
