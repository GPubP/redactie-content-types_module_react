import { StoreConfig } from '@datorama/akita';
import { CacheEntityStore } from '@redactie/utils';

import {
	FieldTypeDetailModel,
	FieldTypesDetailState,
	FieldTypesDetailUIState,
} from './fieldTypes-detail.model';

@StoreConfig({ name: 'content-types-field-types-detail', idKey: 'uuid' })
export class FieldTypesDetailStore extends CacheEntityStore<
	FieldTypesDetailUIState,
	FieldTypesDetailState,
	FieldTypeDetailModel
> {}

export const fieldTypesDetailStore = new FieldTypesDetailStore();
