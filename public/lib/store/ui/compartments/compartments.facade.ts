import { CompartmentModel, CompartmentRegisterOptions } from './compartments.model';
import { compartmentsQuery, CompartmentsQuery } from './compartments.query';
import { compartmentsStore, CompartmentsStore } from './compartments.store';

export class CompartmentsFacade {
	constructor(private store: CompartmentsStore, private query: CompartmentsQuery) {}

	public readonly all$ = this.query.all$;
	public readonly allVisible$ = this.query.allVisible$;
	public readonly active$ = this.query.active$;

	public register(
		data: CompartmentModel | CompartmentModel[],
		options: CompartmentRegisterOptions = {}
	): void {
		const compartments = Array.isArray(data) ? data : [data];

		compartments.forEach(compartment => {
			const parsedCompartment = {
				...compartment,
				isVisible:
					compartment.filter && typeof compartment.filter === 'function'
						? compartment.isVisible ?? false
						: compartment.isVisible ?? true,
			};

			if (!options?.replace) {
				this.store.add(parsedCompartment);
				return;
			}

			this.store.upsert(parsedCompartment.name, parsedCompartment);
		});
	}

	public clearCompartments(): void {
		this.store.reset();
	}

	public setActiveByNamOrSlug(id: string): void {
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

	public setActive(name: string): void {
		if (this.query.hasActive(name)) {
			return;
		}
		this.store.setActive(name);
	}

	public setValid(name: string, isValid: boolean): void {
		const compartment = this.query.getEntity(name);
		if (compartment.isValid === isValid) {
			return;
		}
		this.store.update(name, { isValid });
	}

	public setIsVisible(name: string, isVisible: boolean): void {
		const compartment = this.query.getEntity(name);
		if (compartment.isVisible === isVisible) {
			return;
		}
		this.store.update(name, { isVisible });
	}
}

export const compartmentsFacade = new CompartmentsFacade(compartmentsStore, compartmentsQuery);
