import { EntityStore, StoreConfig } from '@datorama/akita';

import {
	CompartmentModel,
	CompartmentState,
	createInitialCompartmentState,
} from './compartments.model';

@StoreConfig({ name: 'compartments', idKey: 'name', resettable: true })
export class CompartmentsStore extends EntityStore<CompartmentState, CompartmentModel> {
	constructor() {
		super(createInitialCompartmentState());
	}
}

export const compartmentsStore = new CompartmentsStore();
