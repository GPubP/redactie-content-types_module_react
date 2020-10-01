import { QueryEntity } from '@datorama/akita';

import { CompartmentState } from './compartments.model';
import { compartmentsStore, CompartmentsStore } from './compartments.store';

export class CompartmentsQuery extends QueryEntity<CompartmentState> {
	public all$ = this.selectAll();
	public active$ = this.selectActive();

	constructor(protected store: CompartmentsStore) {
		super(store);
	}
}

export const compartmentsQuery = new CompartmentsQuery(compartmentsStore);
