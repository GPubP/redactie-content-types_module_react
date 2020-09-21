import { ID } from '@datorama/akita';

import { CompartmentModel, CompartmentRegisterOptions } from './compartments.model';
import { compartmentsQuery, CompartmentsQuery } from './compartments.query';
import { compartmentsStore, CompartmentsStore } from './compartments.store';

export class CompartmentsFacade {
	constructor(private store: CompartmentsStore, private query: CompartmentsQuery) {}

	public readonly all$ = this.query.all$;
	public readonly active$ = this.query.active$;

	public register(
		data: CompartmentModel | CompartmentModel[],
		options: CompartmentRegisterOptions = {}
	): void {
		const compartments = Array.isArray(data) ? data : [data];

		compartments.forEach(compartment => {
			if (!options?.replace) {
				this.store.add(compartment);
				return;
			}

			this.store.upsert(compartment.name, compartment);
		});
	}

	public clearCompartments(): void {
		this.store.reset();
	}

	public setActiveByNamOrSlug(id: ID | string): void {
		const state = this.store.getValue();
		const compartment = Object.values(state?.entities || {}).find(
			compartment => compartment.slug === id
		);

		if (compartment) {
			this.setActive(compartment.name);
			return;
		}

		return this.setActive(id);
	}

	public setActive(name: ID): void {
		this.store.setActive(name);
	}

	public setValid(name: string, isValid: boolean): void {
		this.store.update(name, { isValid });
	}
}

export const compartmentsFacade = new CompartmentsFacade(compartmentsStore, compartmentsQuery);
