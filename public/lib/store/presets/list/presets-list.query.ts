import { combineQueries } from '@datorama/akita';
import { CacheEntityQuery } from '@redactie/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { presetsDetailQuery, PresetsDetailQuery } from '../detail';
import { PresetUIModel } from '../presets.types';

import { PresetsListState } from './presets-list.model';
import { PresetsListStore, presetsListStore } from './presets-list.store';

export class PresetsListQuery extends CacheEntityQuery<any, PresetsListState> {
	constructor(protected store: PresetsListStore, protected detailQuery: PresetsDetailQuery) {
		super(store);
	}

	public presets$ = this.selectAll();

	public getIsFetching(): boolean {
		return this.getValue().isFetching;
	}

	public selectUIState(): Observable<PresetUIModel> {
		return combineQueries([
			this.select(['error', 'isFetching']),
			this.detailQuery.select(['error', 'isCreating']),
		]).pipe(
			map(([globalListUIState, globalDetailState]) => {
				const error = globalListUIState.error || globalDetailState.error;

				return {
					isCreating: globalDetailState.isCreating,
					isFetching: globalListUIState.isFetching,
					error,
				};
			})
		);
	}
}

export const presetsListQuery = new PresetsListQuery(presetsListStore, presetsDetailQuery);
