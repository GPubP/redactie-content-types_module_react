import { arrayAdd, arrayRemove, arrayUpdate } from '@datorama/akita';
import { AlertProps, alertService, BaseEntityFacade, SearchParams } from '@redactie/utils';
import { insert, move, omit } from 'ramda';

import { ALERT_CONTAINER_IDS, CONTENT_COMPARTMENT_UUID } from '../../contentTypes.const';
import {
	Compartment,
	ContentTypeCreateRequest,
	ContentTypeDetailResponse,
	ContentTypeFieldDetail,
	ContentTypesApiService,
	contentTypesApiService,
	ContentTypeUpdateRequest,
} from '../../services/contentTypes';
import { presetsFacade, PresetsFacade } from '../presets';

import { getAlertMessages } from './contentTypes.messages';
import { ContentTypeFieldDetailModel } from './contentTypes.model';
import { ContentTypesQuery, contentTypesQuery } from './contentTypes.query';
import { ContentTypesStore, contentTypesStore } from './contentTypes.store';

export class ContentTypesFacade extends BaseEntityFacade<
	ContentTypesStore,
	ContentTypesApiService,
	ContentTypesQuery
> {
	public readonly meta$ = this.query.meta$;
	public readonly contentTypes$ = this.query.contentTypes$;
	public readonly contentType$ = this.query.contentType$;
	public readonly activeField$ = this.query.activeField$;
	public readonly fieldsByCompartments$ = this.query.fieldsByCompartments$;
	private readonly presetFacade: PresetsFacade;

	constructor(
		store: ContentTypesStore,
		service: ContentTypesApiService,
		query: ContentTypesQuery,
		presetFacade: PresetsFacade
	) {
		super(store, service, query);
		this.presetFacade = presetFacade;
	}

	public getDynamicFieldValue(): ContentTypeFieldDetail | null {
		const { activeField } = this.store.getValue();

		return activeField || null;
	}

	public getContentTypes(payload: SearchParams): void {
		const { isFetching } = this.query.getValue();
		if (isFetching) {
			return;
		}

		this.store.setIsFetching(true);

		this.service
			.getContentTypes(payload)
			.then(response => {
				if (response) {
					this.store.set(response.data);
					this.store.update({
						error: null,
						isFetching: false,
						meta: response.paging,
					});
				}
			})
			.catch(error => {
				this.store.update({
					error,
					isFetching: false,
				});
			});
	}

	public getSiteTenantContentTypes(siteId: string, payload: SearchParams): void {
		const { isFetching } = this.query.getValue();
		if (isFetching) {
			return;
		}

		this.store.setIsFetching(true);

		this.service
			.getSiteTenantContentTypes(siteId, payload)
			.then(response => {
				if (response) {
					this.store.set(response.data);
					this.store.update({
						error: null,
						isFetching: false,
						meta: response.paging,
					});
				}
			})
			.catch(error => {
				this.store.update({
					error,
					isFetching: false,
				});
			});
	}

	public getContentType(uuid: string): void {
		const { isFetchingOne, contentType } = this.query.getValue();

		if (isFetchingOne || contentType?.uuid === uuid) {
			return;
		}

		this.store.setIsFetchingOne(true);
		this.service
			.getContentType(uuid)
			.then(response => {
				if (response) {
					this.store.update({
						error: null,
						isFetchingOne: false,
						contentType: response,
					});
				}
			})
			.catch(error => {
				this.store.update({
					error,
					isFetchingOne: false,
				});
			});
	}

	public getSiteContentType(siteUuid: string, contentTypeUuid: string): void {
		const { isFetchingOne, contentType } = this.query.getValue();

		if (isFetchingOne || contentType?.uuid === contentTypeUuid) {
			return;
		}

		this.store.setIsFetchingOne(true);
		this.service
			.getSiteContentType(siteUuid, contentTypeUuid)
			.then(response => {
				if (response) {
					this.store.update({
						error: null,
						isFetchingOne: false,
						contentType: response,
					});
				}
			})
			.catch(error => {
				this.store.update({
					error,
					isFetchingOne: false,
				});
			});
	}

	public createContentType(payload: ContentTypeCreateRequest): Promise<void> {
		this.store.setIsCreating(true);

		const alertMessages = getAlertMessages((payload as unknown) as ContentTypeDetailResponse);

		return this.service
			.createContentType(payload)
			.then(response => {
				if (response) {
					this.store.update({
						error: null,
						isCreating: false,
						contentType: response,
					});

					this.alertService(
						alertMessages.create.success,
						ALERT_CONTAINER_IDS.create,
						'success'
					);
				}
			})
			.catch(error => {
				this.store.update({
					error,
					isCreating: false,
				});
				this.alertService(alertMessages.create.error, ALERT_CONTAINER_IDS.create, 'error');
			});
	}

	public clearContentType(): void {
		this.store.update({
			contentType: undefined,
		});
	}

	public updateContentType(
		payload: ContentTypeUpdateRequest,
		containerId: ALERT_CONTAINER_IDS
	): Promise<void> {
		this.store.setIsUpdating(true);
		const alertMessages = getAlertMessages((payload as unknown) as ContentTypeDetailResponse);

		return this.service
			.updateContentType(payload)
			.then(response => {
				if (response) {
					const { contentType } = this.store.getValue();
					const fields = this.service.parseContentTypeFields(
						response.fields,
						contentType?.fields || []
					);

					this.store.update({
						error: null,
						isUpdating: false,
						contentType: {
							...response,
							fields,
						},
					});
					this.presetFacade.resetDetailStore();
					this.alertService(alertMessages.update.success, containerId, 'success');
				}
			})
			.catch(error => {
				this.store.update({
					error,
					isUpdating: false,
				});
				this.alertService(alertMessages.update.error, containerId, 'error');
			});
	}

	public addField(field: ContentTypeFieldDetailModel): void {
		const { contentType } = this.query.getValue();

		if (contentType) {
			const fieldsLength = (contentType.fields || []).filter(
				f => f.compartment.uuid === field.compartment.uuid
			).length;
			this.store.update({
				contentType: {
					...contentType,
					fields: [
						...contentType.fields,
						omit(['__new'])({
							...field,
							compartment: {
								...field.compartment,
								position: fieldsLength,
							},
						}),
					],
				},
			});
		}
	}

	public deleteField(uuid: string): void {
		const { contentType } = this.query.getValue();
		if (contentType) {
			this.store.update({
				contentType: {
					...contentType,
					fields: contentType.fields.filter(field => field.uuid !== uuid),
				},
			});
		}
	}

	public updateField(updatedField: ContentTypeFieldDetailModel): void {
		const { contentType } = this.query.getValue();

		if (contentType) {
			this.store.update({
				contentType: {
					...contentType,
					fields: contentType.fields.map(field =>
						field.uuid === updatedField.uuid ? updatedField : field
					),
				},
			});
		}
	}

	public removeCompartment(uuid: string): void {
		this.store.setIsUpdating(true);

		this.store.update(state => {
			if (!state.contentType) {
				return state;
			}
			const fields = state.contentType?.fields || [];
			const otherFields = fields.filter(
				f =>
					f.compartment?.uuid !== uuid && f.compartment?.uuid !== CONTENT_COMPARTMENT_UUID
			);
			const fieldsToMove = fields
				.filter(f => f.compartment?.uuid === uuid)
				.sort((a, b) => a.compartment?.position - b.compartment?.position);
			const contentCompartmentFields = fields
				.filter(f => f.compartment?.uuid === CONTENT_COMPARTMENT_UUID)
				.sort((a, b) => a.compartment?.position - b.compartment?.position);
			const newContentCompartmentFields = [...contentCompartmentFields, ...fieldsToMove].map(
				(f, index) => ({
					...f,
					compartment: {
						uuid: CONTENT_COMPARTMENT_UUID,
						position: index,
					},
				})
			);
			const newFields = [...newContentCompartmentFields, ...otherFields];

			return {
				contentType: {
					...state.contentType,
					compartments: arrayRemove(state.contentType.compartments, uuid, 'uuid'),
					fields: newFields,
				},
			};
		});
	}

	public updateCompartment(uuid: string, compartment: Partial<Compartment>): void {
		this.store.update(state => {
			if (!state.contentType) {
				return state;
			}
			return {
				contentType: {
					...state.contentType,
					compartments: arrayUpdate(
						state.contentType.compartments,
						uuid,
						compartment,
						'uuid'
					),
				},
			};
		});
	}

	public updateCompartments(compartments: Compartment[]): void {
		this.store.update(state => {
			if (!state.contentType) {
				return state;
			}
			return {
				contentType: {
					...state.contentType,
					compartments,
				},
			};
		});
	}

	public updateFieldCompartment(
		fieldUuid: string,
		targetCompartmentUuid: string,
		sourcePosition: number,
		targetPosition: number,
		moveFieldToCompartment: boolean
	): void {
		this.store.update(state => {
			if (!state.contentType) {
				return state;
			}
			const fields = state.contentType?.fields || [];

			// Get all fields that exist on the target compartment
			const targetCompartmentFields = fields
				.filter(f => f.compartment?.uuid === targetCompartmentUuid)
				.sort((a, b) => a.compartment?.position - b.compartment?.position);
			// Check if the field is moved inside the target compartment
			const fieldMovedInTargetList = targetCompartmentFields.find(f => f.uuid === fieldUuid);

			// Don't update the state when the field was dropped on the root item (compartment - level one) inside his own
			// compartment. This because the field is already visible inside the compartment
			if (fieldMovedInTargetList && moveFieldToCompartment) {
				return;
			}

			// Get the moved field
			const movedField = fields.find(f => f.uuid === fieldUuid);
			// Get all fields that are not visible inside the target compartment
			const otherFields = fields.filter(
				f => f.compartment?.uuid !== targetCompartmentUuid && f.uuid !== fieldUuid
			);

			// Calculate the new target compartment fields
			const newTargetCompartmentFields = (fieldMovedInTargetList
				? move(sourcePosition, targetPosition, targetCompartmentFields)
				: insert(targetPosition, movedField, targetCompartmentFields)
			).map((f, index) => ({
				...f,
				compartment: {
					uuid: targetCompartmentUuid,
					position: index,
				},
			}));
			// concat all fields
			const newFields = [...newTargetCompartmentFields, ...otherFields];

			return {
				contentType: {
					...state.contentType,
					fields: newFields,
				},
				isUpdating: false,
			};
		});
	}

	public addCompartment(compartment: Compartment): void {
		this.store.update(state => ({
			...state,
			contentType: {
				...state.contentType,
				compartments: arrayAdd(state.contentType?.compartments || [], compartment),
			},
		}));
	}

	/**
	 *
	 * Active Field actions
	 */

	public setActiveField(payload: ContentTypeFieldDetailModel): void {
		this.store.update({
			activeField: payload,
		});
	}

	public updateActiveField(payload: Partial<ContentTypeFieldDetailModel>): void {
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
					checks: payload.validation?.checks || activeField.validation?.checks || [],
				},
				defaultValue: clearDefaultValue ? undefined : payload.defaultValue,
			} as ContentTypeFieldDetailModel,
		});
	}

	public clearActiveField(): void {
		this.store.update({
			activeField: undefined,
		});
	}

	/**
	 * Alert service
	 */

	private alertService(
		alertProps: AlertProps,
		containerId: ALERT_CONTAINER_IDS,
		type: 'success' | 'error'
	): void {
		const alertType = type === 'error' ? 'danger' : type;
		const alertOptions = { containerId: containerId };

		alertService[alertType](alertProps, alertOptions);
	}
}

export const contentTypesFacade = new ContentTypesFacade(
	contentTypesStore,
	contentTypesApiService,
	contentTypesQuery,
	presetsFacade
);
