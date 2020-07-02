import { StoreConfig } from '@datorama/akita';

import { BaseEntityStore } from '../shared';

import { FieldTypeModel, FieldTypesState } from './fieldTypes.model';

@StoreConfig({ name: 'fieldTypes', idKey: 'uuid' })
export class FieldTypesStore extends BaseEntityStore<FieldTypesState, FieldTypeModel> {
	constructor() {
		super();
	}
}

export const fieldTypesStore = new FieldTypesStore();
