import { CacheEntityQuery } from '@redactie/utils';

import { FieldTypesDetailState, FieldTypesDetailUIState } from './fieldTypes-detail.model';
import { FieldTypesDetailStore, fieldTypesDetailStore } from './fieldTypes-detail.store';

export class FieldTypesDetailQuery extends CacheEntityQuery<
	FieldTypesDetailUIState,
	FieldTypesDetailState
> {
	constructor(protected store: FieldTypesDetailStore) {
		super(store);
	}
}

export const fieldTypesDetailQuery = new FieldTypesDetailQuery(fieldTypesDetailStore);
