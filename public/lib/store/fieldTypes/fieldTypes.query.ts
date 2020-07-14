import { distinctUntilChanged } from 'rxjs/operators';

import { BaseEntityQuery } from '../shared';

import { FieldTypesState } from './fieldTypes.model';
import { FieldTypesStore, fieldTypesStore } from './fieldTypes.store';

export class FieldTypesQuery extends BaseEntityQuery<FieldTypesState> {
	constructor(protected store: FieldTypesStore) {
		super(store);
	}

	public fieldTypes$ = this.selectAll();
	public fieldType$ = this.select(state => state.fieldType).pipe(distinctUntilChanged());
}

export const fieldTypesQuery = new FieldTypesQuery(fieldTypesStore);
