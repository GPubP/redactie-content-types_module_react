import { StoreConfig } from '@datorama/akita';
import { CacheEntityStore } from '@redactie/utils';

import { FieldTypeListModel, FieldTypesListState } from './fieldTypes-list.model';

@StoreConfig({ name: 'content-types-field-types-list', idKey: 'uuid' })
export class FieldTypesListStore extends CacheEntityStore<
	any,
	FieldTypesListState,
	FieldTypeListModel
> {}

export const fieldTypesListStore = new FieldTypesListStore();
