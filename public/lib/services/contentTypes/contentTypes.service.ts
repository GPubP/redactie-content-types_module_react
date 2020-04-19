import api, { parseSearchParams } from '../api/api.service';
import { SearchParams } from '../api/api.service.types';

import { DEFAULT_CONTENT_TYPES_SEARCH_PARAMS } from './contentTypes.service.cont';
import {
	ContentTypeResponse,
	ContentTypeSchema,
	ContentTypesSchema,
} from './contentTypes.service.types';

export const getContentTypes = async (
	searchParams: SearchParams = DEFAULT_CONTENT_TYPES_SEARCH_PARAMS
): Promise<ContentTypesSchema | null> => {
	try {
		const response: ContentTypesSchema = await api
			.get(`content/content-types?${parseSearchParams(searchParams)}`)
			.json();

		if (!response) {
			throw new Error('Failed to get content-types');
		}

		return response;
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const getContentType = async (uuid: string): Promise<ContentTypeResponse | null> => {
	try {
		const response: ContentTypeResponse = await api.get(`content/content-types/${uuid}`).json();

		return response;
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const updateContentType = async (
	contentType: ContentTypeSchema
): Promise<ContentTypeResponse | null> => {
	const response: ContentTypeResponse = await api
		.put(`content/content-types/${contentType.uuid}`, {
			json: contentType,
		})
		.json();

	return response;
};

export const createContentType = async (
	contentType: ContentTypeSchema
): Promise<ContentTypeResponse | null> => {
	const response: ContentTypeResponse = await api
		.post('content/content-types', {
			json: contentType,
		})
		.json();

	return response;
};
