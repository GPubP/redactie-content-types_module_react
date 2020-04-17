import { Store, StoreConfig } from '@datorama/akita';

import { InternalState } from './internal.model';

export const createInitialInternalState = (): InternalState => ({
	activeField: null,
	fields: [],
});

@StoreConfig({ name: 'content-types' })
export class InternalStore extends Store<InternalState> {
	constructor() {
		super(createInitialInternalState());
	}
}

export const internalStore = new InternalStore();
