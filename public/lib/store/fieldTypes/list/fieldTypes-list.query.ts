import { CacheEntityQuery } from '@redactie/utils';

import { FieldTypesListState } from './fieldTypes-list.model';
import { FieldTypesListStore, fieldTypesListStore } from './fieldTypes-list.store';

export class FieldTypesListQuery extends CacheEntityQuery<any, FieldTypesListState> {
	constructor(protected store: FieldTypesListStore) {
		super(store);
	}

	public fieldTypes$ = this.selectAll();
}

export const fieldTypesListQuery = new FieldTypesListQuery(fieldTypesListStore);
