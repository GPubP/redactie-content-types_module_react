import api, { parseSearchParams } from '../api/api.service';
import { SearchParams } from '../api/api.service.types';

import { DEFAULT_CONTENT_TYPES_SEARCH_PARAMS } from './contentTypes.service.cont';
import {
	ContentTypeSchema,
	ContentTypesDataSchema,
	ContentTypesSchema,
} from './contentTypes.service.types';

export const getContentTypes = async (
	searchParams: SearchParams = DEFAULT_CONTENT_TYPES_SEARCH_PARAMS
): Promise<ContentTypesDataSchema | null> => {
	try {
		const response: ContentTypesSchema = await api
			.get('content/content-types', {
				searchParams: parseSearchParams(searchParams),
			})
			.json();

		if (!response.data) {
			throw new Error('Failed to get content-types');
		}

		return {
			data: response.data,
		};
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const getContentType = async (uuid: string): Promise<ContentTypeSchema | null> => {
	try {
		const response: ContentTypeSchema = await api.get(`content/content-types/${uuid}`).json();

		return response;
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const updateContentType = async (
	contentType: ContentTypeSchema
): Promise<ContentTypeSchema | null> => {
	const response: ContentTypeSchema = await api
		.put(`content/content-types/${contentType.uuid}`, {
			json: contentType,
		})
		.json();

	return response;
};

export const createContentType = async (
	contentType: ContentTypeSchema
): Promise<ContentTypeSchema | null> => {
	const response: ContentTypeSchema = await api
		.post('content/content-types', {
			json: contentType,
		})
		.json();

	return response;
};
