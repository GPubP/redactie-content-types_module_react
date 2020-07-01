import api, { parseSearchParams } from '../api/api.service';
import { SearchParams } from '../api/api.service.types';

import {
	CONTENT_TYPES_PREFIX_URL,
	CONTENT_TYPES_PROXY_PREFIX_URL,
	DEFAULT_CONTENT_TYPES_SEARCH_PARAMS,
} from './contentTypes.service.cont';
import {
	ContentTypeCreateRequest,
	ContentTypeDetailResponse,
	ContentTypeFieldDetailResponse,
	ContentTypeFieldResponse,
	ContentTypesResponse,
	ContentTypeUpdateRequest,
} from './contentTypes.service.types';

export class ContentTypesApiService {
	private parseContentTypeDetailFields(
		fields: ContentTypeFieldDetailResponse[]
	): ContentTypeFieldResponse[] {
		return fields.map(field => ({
			...field,
			dataType: field.dataType.uuid,
			fieldType: field.fieldType.uuid,
		}));
	}

	public async getContentTypes(
		searchParams: SearchParams = DEFAULT_CONTENT_TYPES_SEARCH_PARAMS
	): Promise<ContentTypesResponse | null> {
		try {
			const response: ContentTypesResponse = await api
				.get(`${CONTENT_TYPES_PROXY_PREFIX_URL}?${parseSearchParams(searchParams)}`)
				.json();

			if (!response) {
				throw new Error('Failed to get content-types');
			}

			return response;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	public async getContentType(uuid: string): Promise<ContentTypeDetailResponse | null> {
		try {
			const response: ContentTypeDetailResponse = await api
				.get(`${CONTENT_TYPES_PROXY_PREFIX_URL}/${uuid}`)
				.json();

			return response;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	public async updateContentType(
		contentType: ContentTypeUpdateRequest
	): Promise<ContentTypeDetailResponse | null> {
		const data = {
			...contentType,
			fields: this.parseContentTypeDetailFields(contentType.fields),
		};
		const response: ContentTypeDetailResponse = await api
			.put(`${CONTENT_TYPES_PREFIX_URL}/${contentType.uuid}`, {
				json: data,
			})
			.json();

		return response;
	}

	public async createContentType(
		contentType: ContentTypeCreateRequest
	): Promise<ContentTypeDetailResponse | null> {
		const response: ContentTypeDetailResponse = await api
			.post(CONTENT_TYPES_PREFIX_URL, {
				json: contentType,
			})
			.json();

		return response;
	}
}

export const contentTypesApiService = new ContentTypesApiService();
