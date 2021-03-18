import { QueryEntity } from '@datorama/akita';
import { map } from 'rxjs/operators';

import { CompartmentState } from './compartments.model';
import { compartmentsStore, CompartmentsStore } from './compartments.store';

export class CompartmentsQuery extends QueryEntity<CompartmentState> {
	public all$ = this.selectAll();
	public active$ = this.selectActive();
	public allVisible$ = this.selectAll().pipe(
		map(compartments =>
			compartments.filter(compartment => {
				if (
					typeof compartment.filter === 'function' &&
					(compartment.isVisible === undefined || compartment.isVisible === null)
				) {
					return false;
				}
				return compartment.isVisible ?? true;
			})
		)
	);

	constructor(protected store: CompartmentsStore) {
		super(store);
	}
}

export const compartmentsQuery = new CompartmentsQuery(compartmentsStore);
