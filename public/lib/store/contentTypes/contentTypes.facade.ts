import { SearchParams } from '../../services/api/api.service.types';
import {
	ContentTypeCreateRequest,
	contentTypesApiService,
	ContentTypesApiService,
	ContentTypeUpdateRequest,
} from '../../services/contentTypes';

import { ContentTypeFieldDetailModel } from './contentTypes.model';
import { ContentTypesQuery, contentTypesQuery } from './contentTypes.query';
import { ContentTypesStore, contentTypesStore } from './contentTypes.store';

export class ContentTypesFacade {
	constructor(
		private store: ContentTypesStore,
		private service: ContentTypesApiService,
		private query: ContentTypesQuery
	) {}

	public readonly meta$ = this.query.meta$;
	public readonly contentTypes$ = this.query.contentTypes$;
	public readonly contentType$ = this.query.contentType$;
	public readonly activeField$ = this.query.activeField$;
	public readonly isFetching$ = this.query.isFetching$;
	public readonly isCreating$ = this.query.isCreating$;
	public readonly isUpdating$ = this.query.isUpdating$;
	public readonly error$ = this.query.error$;

	public getContentTypes(payload: SearchParams): void {
		this.store.setIsFetching(true);

		this.service
			.getContentTypes(payload)
			.then(response => {
				this.store.setIsFetching(false);

				if (response) {
					const meta = response.paging;

					this.store.update({
						meta,
					});

					this.store.set(response.data);
				}
			})
			.catch(error => {
				this.store.setIsFetching(false);
				this.store.setError(error);
			});
	}

	public getContentType(uuid: string): void {
		this.store.setIsFetching(true);
		this.service
			.getContentType(uuid)
			.then(response => {
				this.store.setIsFetching(false);
				if (response) {
					this.store.update({
						contentType: response,
					});
				}
			})
			.catch(error => {
				this.store.setIsFetching(false);
				this.store.setError(error);
			});
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
				this.store.setIsCreating(false);
			})
			.catch(error => {
				this.store.setIsCreating(false);
				this.store.setError(error);
			});
	}

	public updateContentType(payload: ContentTypeUpdateRequest): void {
		this.store.setIsUpdating(true);

		this.service
			.updateContentType(payload)
			.then(response => {
				if (response) {
					this.store.update({
						contentType: response,
					});
				}
				this.store.setIsUpdating(false);
			})
			.catch(error => {
				this.store.setIsUpdating(false);
				this.store.setError(error);
			});
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
