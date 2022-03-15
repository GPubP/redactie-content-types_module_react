import { BaseEntityFacade } from '@redactie/utils';

import { showAlert } from '../../helpers';
import {
	metadataApiService,
	MetadataApiService,
	MetadataCreateRequest,
	MetadataUpdateRequest,
} from '../../services/metadata';
import { ContentTypeDetailModel } from '../contentTypes';

import { getAlertMessages } from './metadata.messages';
import { MetadataQuery, metadataQuery } from './metadata.query';
import { metadataStore, MetadataStore } from './metadata.store';

export class MetadataFacade extends BaseEntityFacade<
	MetadataStore,
	MetadataApiService,
	MetadataQuery
> {
	public readonly metadata$ = this.query.metadata$;

	constructor(store: MetadataStore, service: MetadataApiService, query: MetadataQuery) {
		super(store, service, query);
	}

	public async createMetadata(
		siteId: string,
		contentType: ContentTypeDetailModel,
		payload: MetadataCreateRequest,
		containerId: string
	): Promise<void> {
		this.store.setIsCreating(true);

		const alertMessages = getAlertMessages(contentType.meta.label);

		return this.service
			.createMetadata(siteId, contentType.uuid, payload)
			.then(metadata => {
				this.store.update({
					isCreating: false,
					error: null,
					metadata,
				});

				showAlert(containerId, 'success', alertMessages.upsert.success);
			})
			.catch(error => {
				showAlert(containerId, 'error', alertMessages.upsert.error);
				this.store.update({
					isCreating: false,
					error,
				});
			});
	}

	public async updateMetadata(
		siteId: string,
		contentType: ContentTypeDetailModel,
		metadataId: string,
		payload: MetadataUpdateRequest,
		containerId: string
	): Promise<void> {
		this.store.setIsUpdating(true);

		const alertMessages = getAlertMessages(contentType.meta.label);

		return this.service
			.updateMetadata(siteId, contentType.uuid, metadataId, payload)
			.then(metadata => {
				this.store.update({
					isUpdating: false,
					error: null,
					metadata,
				});

				showAlert(containerId, 'success', alertMessages.upsert.success);
			})
			.catch(error => {
				showAlert(containerId, 'error', alertMessages.upsert.error);
				this.store.update({
					isUpdating: false,
					error,
				});
			});
	}
}

export const metadataFacade = new MetadataFacade(metadataStore, metadataApiService, metadataQuery);
