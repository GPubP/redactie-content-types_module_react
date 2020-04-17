import { Query } from '@datorama/akita';

import { InternalState } from './internal.model';
import { internalStore, InternalStore } from './internal.store';

export class InternalQuery extends Query<InternalState> {
	constructor(protected store: InternalStore) {
		super(store);
	}

	public activeField$ = this.select(state => state.activeField);
	public fields$ = this.select(state => state.fields);
}

export const internalQuery = new InternalQuery(internalStore);
