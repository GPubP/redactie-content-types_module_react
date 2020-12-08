import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { SearchParams } from '@redactie/utils';
import { from, Observable } from 'rxjs';

import { presetsApiService, PresetsApiService } from '../../services/presets';

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
import { PresetUIModel } from './presets.types';

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
		clearCache = false
	): Observable<PaginationResponse<PresetListModel>> {
		if (clearCache) {
			this.listPaginator.clearCache();
		}

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
					this.listStore.update({
						error,
						isFetching: false,
					});
					throw error;
				})
		);
	}

	public getPresets(): void {
		const { isFetching } = this.listQuery.getValue();

		if (isFetching) {
			return;
		}
		this.listStore.setIsFetching(true);

		this.service
			.getPresets()
			.then(response => {
				if (response) {
					this.listStore.set(response.data);
				}
			})
			.catch(error => this.listStore.setError(error))
			.finally(() => this.listStore.setIsFetching(false));
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

	public getPreset(presetId: string, force = false): void {
		if (this.detailQuery.hasEntity(presetId) && !force) {
			return;
		}
		this.detailStore.setIsFetchingEntity(true, presetId);
		this.service
			.getPreset(presetId)
			.then(response => {
				this.detailStore.upsert(response.uuid, response);
				this.detailStore.ui.upsert(response.uuid, { error: null, isFetching: false });
			})
			.catch(error => {
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
