import { isNil } from '@datorama/akita';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { CONTENT_COMPARTMENT_UUID } from '../../contentTypes.const';
import { BaseEntityQuery } from '../shared';

import { ContentTypesState, FieldsByCompartment } from './contentTypes.model';
import { ContentTypesStore, contentTypesStore } from './contentTypes.store';

export class ContentTypesQuery extends BaseEntityQuery<ContentTypesState> {
	constructor(protected store: ContentTypesStore) {
		super(store);
	}

	public meta$ = this.select(state => state.meta).pipe(
		filter(meta => !isNil(meta), distinctUntilChanged())
	);
	public contentTypes$ = this.selectAll();
	public contentType$ = this.select(state => state.contentType).pipe(
		filter(contentType => !isNil(contentType), distinctUntilChanged())
	);
	public activeField$ = this.select(state => state.activeField).pipe(
		filter(activeField => !isNil(activeField), distinctUntilChanged())
	);
	public pageTitle$ = this.select(state => state.pageTitle);

	public fieldsByCompartments$ = this.contentType$.pipe(
		map(contentType => {
			return (contentType?.compartments || []).reduce((acc, compartment) => {
				acc.push({
					uuid: compartment.uuid,
					label: compartment.label,
					fields: (contentType?.fields || [])
						.filter(field => {
							if (
								compartment.uuid === CONTENT_COMPARTMENT_UUID &&
								!field.compartment?.uuid
							) {
								return true;
							}
							return field.compartment?.uuid === compartment.uuid;
						})
						.sort((a, b) => a.compartment?.position - b.compartment?.position),
				});

				return acc;
			}, [] as FieldsByCompartment[]);
		})
	);
}

export const contentTypesQuery = new ContentTypesQuery(contentTypesStore);
