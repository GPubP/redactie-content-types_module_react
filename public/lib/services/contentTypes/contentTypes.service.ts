import { api } from '../api';

import { ContentTypeSchema, ContentTypesSchema } from './contentTypes.service.types';

export const getContentTypes = async (): Promise<ContentTypeSchema[] | null> => {
	try {
		const response: ContentTypesSchema = await api.get('content/content-types').json();

		return response.data;
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
