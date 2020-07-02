import { SearchParams } from '../../services/api/api.service.types';
import {
	ContentTypeCreateRequest,
	contentTypesApiService,
	ContentTypesApiService,
	ContentTypeUpdateRequest,
} from '../../services/contentTypes';
import { BaseEntityFacade } from '../shared';

import { ContentTypeFieldDetailModel } from './contentTypes.model';
import { ContentTypesQuery, contentTypesQuery } from './contentTypes.query';
import { ContentTypesStore, contentTypesStore } from './contentTypes.store';

export class ContentTypesFacade extends BaseEntityFacade<
	ContentTypesStore,
	ContentTypesApiService,
	ContentTypesQuery
> {
	constructor(
		store: ContentTypesStore,
		service: ContentTypesApiService,
		query: ContentTypesQuery
	) {
		super(store, service, query);
	}

	public readonly meta$ = this.query.meta$;
	public readonly contentTypes$ = this.query.contentTypes$;
	public readonly contentType$ = this.query.contentType$;
	public readonly activeField$ = this.query.activeField$;

	public getContentTypes(payload: SearchParams): void {
		this.store.setIsFetching(true);

		this.service
			.getContentTypes(payload)
			.then(response => {
				if (response) {
					this.store.set(response.data);
					this.store.update({
						meta: response.paging,
					});
				}
			})
			.catch(error => this.store.setError(error))
			.finally(() => this.store.setIsFetching(false));
	}

	public getContentType(uuid: string): void {
		this.store.setIsFetching(true);
		this.service
			.getContentType(uuid)
			.then(response => {
				if (response) {
					this.store.update({
						contentType: response,
					});
				}
			})
			.catch(error => this.store.setError(error))
			.finally(() => this.store.setIsFetching(false));
	}

	public createContentType(payload: ContentTypeCreateRequest): void {
		this.store.setIsCreating(true);

		this.service
			.createContentType(payload)
			.then(response => {
				if (response) {
					this.store.update({
						contentType: response,
					});
				}
			})
			.catch(error => this.store.setError(error))
			.finally(() => this.store.setIsCreating(false));
	}

	public clearContentType(): void {
		this.store.update({
			contentType: undefined,
		});
	}

	public updateContentType(payload: ContentTypeUpdateRequest): void {
		this.store.setIsUpdating(true);

		this.service
			.updateContentType(payload)
			.then(response => {
				if (response) {
					const { contentType } = this.store.getValue();
					const fields = this.service.parseContentTypeFields(
						response.fields,
						contentType?.fields || []
					);

					this.store.update({
						contentType: {
							...response,
							fields,
						},
					});
				}
			})
			.catch(error => this.store.setError(error))
			.finally(() => this.store.setIsUpdating(false));
	}

	public setActiveField(payload: ContentTypeFieldDetailModel): void {
		this.store.update({
			activeField: payload,
		});
	}

	public addField(field: ContentTypeFieldDetailModel): void {
		const { contentType } = this.query.getValue();
		if (contentType) {
			this.store.update({
				contentType: {
					...contentType,
					fields: [...contentType.fields, field],
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
}

export const contentTypesFacade = new ContentTypesFacade(
	contentTypesStore,
	contentTypesApiService,
	contentTypesQuery
);
