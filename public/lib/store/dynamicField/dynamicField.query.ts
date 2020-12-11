import { isNil } from '@datorama/akita';
import { BaseEntityQuery } from '@redactie/utils';
import { distinctUntilChanged, filter } from 'rxjs/operators';

import { DynamicFieldState } from './dynamicField.model';
import { DynamicFieldStore, dynamicFieldStore } from './dynamicField.store';

export class DynamicFieldQuery extends BaseEntityQuery<DynamicFieldState> {
	constructor(protected store: DynamicFieldStore) {
		super(store);
	}

	public meta$ = this.select(state => state.meta).pipe(
		filter(meta => !isNil(meta), distinctUntilChanged())
	);
	public dynamicField$ = this.select(state => state.dynamicField).pipe(
		filter(dynamicField => !isNil(dynamicField), distinctUntilChanged())
	);
	public activeField$ = this.select(state => state.activeField).pipe(distinctUntilChanged());
}

export const dynamicFieldQuery = new DynamicFieldQuery(dynamicFieldStore);
