import { fieldTypesApiService, FieldTypesApiService } from '../../services/fieldTypes';
import { BaseEntityFacade } from '../shared';

import { FieldTypesQuery, fieldTypesQuery } from './fieldTypes.query';
import { FieldTypesStore, fieldTypesStore } from './fieldTypes.store';

export class FieldTypesFacade extends BaseEntityFacade<
	FieldTypesStore,
	FieldTypesApiService,
	FieldTypesQuery
> {
	constructor(store: FieldTypesStore, service: FieldTypesApiService, query: FieldTypesQuery) {
		super(store, service, query);
	}

	public readonly fieldTypes$ = this.query.fieldTypes$;
	public readonly fieldType$ = this.query.fieldType$;

	public getFieldTypes(): void {
		this.store.setIsFetching(true);

		this.service
			.getFieldTypes()
			.then(response => {
				if (response) {
					this.store.set(response);
				}
			})
			.catch(error => this.store.setError(error))
			.finally(() => this.store.setIsFetching(false));
	}

	public getFieldType(uuid: string): void {
		this.store.setIsFetchingOne(true);

		this.service
			.getFieldType(uuid)
			.then(response => {
				if (response) {
					this.store.update({
						fieldType: response,
					});
				}
			})
			.catch(error => this.store.setError(error))
			.finally(() => this.store.setIsFetchingOne(false));
	}
}

export const fieldTypesFacade = new FieldTypesFacade(
	fieldTypesStore,
	fieldTypesApiService,
	fieldTypesQuery
);
