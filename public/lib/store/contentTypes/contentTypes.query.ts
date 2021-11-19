import { isNil } from '@datorama/akita';
import { BaseEntityQuery } from '@redactie/utils';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { CONTENT_COMPARTMENT_UUID } from '../../contentTypes.const';

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
	public contentType$ = this.select(state => state.contentType).pipe(distinctUntilChanged());
	public siteOccurrences$ = this.select(state => state.siteOccurences).pipe(
		distinctUntilChanged()
	);
	public isRemoving$ = this.select(state => state.isRemoving).pipe(
		map(this.convertBoolToLoadingState),
		distinctUntilChanged()
	);
	public isFetchingSiteModulesConfig$ = this.select(
		state => state.isFetchingSiteModulesConfig
	).pipe(distinctUntilChanged());
	public isFetchingSiteOccurrences$ = this.select(state => state.isFetchingOccurrences).pipe(
		map(this.convertBoolToLoadingState),
		distinctUntilChanged()
	);
	public activeField$ = this.select(state => state.activeField).pipe(distinctUntilChanged());

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
