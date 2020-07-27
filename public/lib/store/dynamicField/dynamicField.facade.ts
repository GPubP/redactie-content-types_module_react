import { omit } from 'ramda';

import { ContentTypesApiService, contentTypesApiService } from '../../services/contentTypes';
import { BaseEntityFacade } from '../shared';

import { DynamicFieldDetailModel } from './dynamicField.model';
import { DynamicFieldQuery, dynamicFieldQuery } from './dynamicField.query';
import { DynamicFieldStore, dynamicFieldStore } from './dynamicField.store';

export class DynamicFieldFacade extends BaseEntityFacade<
	DynamicFieldStore,
	ContentTypesApiService,
	DynamicFieldQuery
> {
	constructor(
		store: DynamicFieldStore,
		service: ContentTypesApiService,
		query: DynamicFieldQuery
	) {
		super(store, service, query);
	}

	public readonly meta$ = this.query.meta$;
	public readonly dynamicField$ = this.query.dynamicField$;
	public readonly activeField$ = this.query.activeField$;

	public getDynamicFieldValue(): DynamicFieldDetailModel | undefined {
		const { dynamicField } = this.query.getValue();

		return dynamicField;
	}

	public setDynamicField(dynamicField: DynamicFieldDetailModel): void {
		this.store.update({
			dynamicField,
		});
	}

	public addField(field: DynamicFieldDetailModel): void {
		const { dynamicField } = this.query.getValue();

		if (!dynamicField) {
			return;
		}

		this.store.update({
			dynamicField: {
				...dynamicField,
				config: {
					...dynamicField.config,
					fields: [...(dynamicField.config.fields || []), omit(['__new'])(field)],
				},
			},
		});
	}

	public deleteField(uuid: string): void {
		const { dynamicField } = this.query.getValue();

		if (!dynamicField) {
			return;
		}

		this.store.update({
			dynamicField: {
				...dynamicField,
				config: {
					...dynamicField.config,
					fields: (dynamicField.config.fields || []).filter(field => field.uuid !== uuid),
				},
			},
		});
	}

	public updateField(updatedField: DynamicFieldDetailModel): void {
		const { dynamicField } = this.query.getValue();

		if (!dynamicField) {
			return;
		}

		this.store.update({
			dynamicField: {
				...dynamicField,
				config: {
					...dynamicField.config,
					fields: (dynamicField.config.fields || []).map(field =>
						field.uuid === updatedField.uuid ? updatedField : field
					),
				},
			},
		});
	}

	public setActiveField(payload: DynamicFieldDetailModel): void {
		this.store.update({
			activeField: payload,
		});
	}

	public updateActiveField(payload: DynamicFieldDetailModel): void {
		const { activeField } = this.query.getValue();

		this.store.update({
			activeField: {
				...(activeField || {}),
				...payload,
			},
		});
	}

	public clearActiveField(): void {
		this.store.update({
			activeField: undefined,
		});
	}
}

export const dynamicFieldFacade = new DynamicFieldFacade(
	dynamicFieldStore,
	contentTypesApiService,
	dynamicFieldQuery
);
