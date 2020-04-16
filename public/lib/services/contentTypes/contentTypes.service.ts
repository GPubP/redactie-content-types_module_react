import { api } from '../api';

import {
	ContentTypeResponse,
	ContentTypeSchema,
	ContentTypesSchema,
} from './contentTypes.service.types';

export const getContentTypes = async (): Promise<ContentTypeResponse[] | null> => {
	try {
		const response: ContentTypesSchema = await api.get('content/content-types').json();

		return response.data;
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
