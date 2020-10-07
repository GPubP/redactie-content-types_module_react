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
		const { activeField } = this.store.getValue();

		if (!activeField) {
			return;
		}

		const payloadIsMultiple =
			(payload?.generalConfig?.max ?? (activeField?.generalConfig?.max || 0)) > 1;
		const activeFieldIsMultiple = (activeField?.generalConfig?.max || 0) > 1;

		// clear default value when switching form single to multiple or the other way around
		const clearDefaultValue = payloadIsMultiple !== activeFieldIsMultiple;

		this.store.update({
			activeField: {
				...activeField,
				...payload,
				generalConfig: {
					...activeField.generalConfig,
					...payload.generalConfig,
				},
				config: {
					...activeField.config,
					...payload.config,
				},
				validation: {
					...activeField.validation,
					...payload.validation,
					checks: [
						...(activeField.validation?.checks || []),
						...(payload.validation?.checks || []),
					],
				},
				defaultValue: clearDefaultValue
					? undefined
					: payload.defaultValue !== undefined
					? payload.defaultValue
					: activeField.defaultValue,
			} as DynamicFieldDetailModel,
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
