import { StoreConfig } from '@datorama/akita';

import { BaseEntityStore } from '../shared';

import { DynamicFieldsModel, DynamicFieldState } from './dynamicField.model';

@StoreConfig({ name: 'dynamicFields', idKey: 'uuid' })
export class DynamicFieldStore extends BaseEntityStore<DynamicFieldState, DynamicFieldsModel> {
	constructor() {
		super();
	}
}

export const dynamicFieldStore = new DynamicFieldStore();
