import { isNil, QueryEntity } from '@datorama/akita';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { LoadingState } from '../../types';

import { ContentTypesState } from './contentTypes.model';
import { ContentTypesStore, contentTypesStore } from './contentTypes.store';

export class ContentTypesQuery extends QueryEntity<ContentTypesState> {
	constructor(protected store: ContentTypesStore) {
		super(store);
	}

	private convertBoolToLoadingState(bool: boolean): LoadingState {
		if (bool) {
			return LoadingState.Loading;
		}

		return LoadingState.Loaded;
	}

	// Data
	public meta$ = this.select(state => state.meta).pipe(
		filter(meta => !isNil(meta), distinctUntilChanged())
	);
	public contentTypes$ = this.selectAll();
	public contentType$ = this.select(state => state.contentType).pipe(
		filter(contentType => !isNil(contentType), distinctUntilChanged())
	);
	public activeField$ = this.select(state => state.activeField).pipe(
		filter(activeField => !isNil(activeField), distinctUntilChanged())
	);

	// State
	public error$ = this.selectError().pipe(filter(error => !isNil(error), distinctUntilChanged()));
	public isFetching$ = this.select(state => state.isFetching).pipe(
		map(this.convertBoolToLoadingState)
	);
	public isCreating$ = this.select(state => state.isCreating).pipe(
		map(this.convertBoolToLoadingState)
	);
	public isUpdating$ = this.select(state => state.isUpdating).pipe(
		map(this.convertBoolToLoadingState)
	);
}

export const contentTypesQuery = new ContentTypesQuery(contentTypesStore);
