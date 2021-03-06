import { SitesResponse } from '@redactie/sites-module';
import { parseSearchParams, SearchParams } from '@redactie/utils';

import api from '../api/api.service';

import {
	CONTENT_TYPES_PREFIX_URL,
	CONTENT_TYPES_PROXY_PREFIX_URL,
	CONTENT_TYPES_SITE_WORKFLOWS_PREFIX_URL,
	DEFAULT_CONTENT_TYPES_SEARCH_PARAMS,
	SITE_CONTENT_TYPES_PROXY_PREFIX_URL,
} from './contentTypes.service.const';
import {
	ContentTypeCreateRequest,
	ContentTypeDetailResponse,
	ContentTypeField,
	ContentTypeFieldDetail,
	ContentTypeResponse,
	ContentTypesResponse,
	ContentTypeUpdateRequest,
	ContentTypeWorkflowUpdateRequest,
	ModuleSettings,
} from './contentTypes.service.types';

export class ContentTypesApiService {
	private parseContentTypeDetailFields(fields: ContentTypeFieldDetail[]): ContentTypeField[] {
		return fields.map(field => ({
			...field,
			// TODO: fieldType detail is not populating the dataType
			// Remove the || operation when this is fixed
			dataType: field.dataType?._id || ((field.dataType as unknown) as string),
			fieldType: field.fieldType?._id,
			preset: field.preset?._id,
		}));
	}

	public parseContentTypeFields(
		fields: ContentTypeField[],
		detailedFields: ContentTypeFieldDetail[]
	): ContentTypeFieldDetail[] {
		return fields.map((field, index) => {
			const dField = detailedFields[index];
			return {
				...field,
				dataType: dField?.dataType || field.dataType,
				fieldType: dField?.fieldType || field.fieldType,
			};
		}) as ContentTypeFieldDetail[];
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

	public async getSiteTenantContentTypes(
		siteId: string,
		searchParams: SearchParams = DEFAULT_CONTENT_TYPES_SEARCH_PARAMS
	): Promise<ContentTypesResponse | null> {
		try {
			const response: ContentTypesResponse = await api
				.get(
					`${SITE_CONTENT_TYPES_PROXY_PREFIX_URL}/${siteId}/tenant-content-types?${parseSearchParams(
						searchParams
					)}`
				)
				.json();

			if (!response) {
				throw new Error('Failed to get site tenant content-types');
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

	public async getContentTypeSiteOccurrences(uuid: string): Promise<SitesResponse> {
		const response: SitesResponse = await api
			.get(`${CONTENT_TYPES_PROXY_PREFIX_URL}/${uuid}/site-occurrences`)
			.json();

		return response;
	}

	public async getSiteContentType(
		siteUuid: string,
		contentTypeUuid: string
	): Promise<ContentTypeDetailResponse | null> {
		try {
			const response: ContentTypeDetailResponse = await api
				.get(
					`${SITE_CONTENT_TYPES_PROXY_PREFIX_URL}/${siteUuid}/tenant-content-types/${contentTypeUuid}`
				)
				.json();

			return response;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	public async updateContentType(
		contentType: ContentTypeUpdateRequest
	): Promise<ContentTypeResponse | null> {
		const data = {
			...contentType,
			fields: this.parseContentTypeDetailFields(contentType.fields),
		};
		const response: ContentTypeResponse = await api
			.put(`${CONTENT_TYPES_PREFIX_URL}/${contentType.uuid}`, {
				json: data,
			})
			.json();

		return response;
	}

	public async updateContentTypeSiteWorkflow(
		payload: ContentTypeWorkflowUpdateRequest,
		contentTypeId: string,
		siteId: string
	): Promise<ModuleSettings | null> {
		const response: ModuleSettings = await api
			.post(
				`${CONTENT_TYPES_SITE_WORKFLOWS_PREFIX_URL}/${siteId}/content-types/${contentTypeId}/workflow-update`,
				{
					json: payload,
				}
			)
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

	public async removeContentType(contentTypeUuid: string): Promise<Response> {
		return await api.delete(`${CONTENT_TYPES_PREFIX_URL}/${contentTypeUuid}`);
	}
}

export const contentTypesApiService = new ContentTypesApiService();
