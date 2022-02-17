import api from '../api/api.service';

import { METADATA_PROXY_PREFIX_URL } from './metadata.service.const';
import {
	MetadataCreateRequest,
	MetadataResponse,
	MetadataUpdateRequest,
} from './metadata.service.types';

export class MetadataApiService {
	public async createMetadata(
		siteId: string,
		contentTypeId: string,
		payload: MetadataCreateRequest
	): Promise<MetadataResponse> {
		return api
			.post(
				`${METADATA_PROXY_PREFIX_URL}/${siteId}/content-types/${contentTypeId}/metadata`,
				{
					json: payload,
				}
			)
			.json();
	}

	public async updateMetadata(
		siteId: string,
		contentTypeId: string,
		metadataId: string,
		payload: MetadataUpdateRequest
	): Promise<MetadataResponse> {
		return api
			.put(
				`${METADATA_PROXY_PREFIX_URL}/${siteId}/content-types/${contentTypeId}/metadata/${metadataId}`,
				{
					json: payload,
				}
			)
			.json();
	}
}

export const metadataApiService = new MetadataApiService();
