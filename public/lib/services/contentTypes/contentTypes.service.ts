import { api } from '../api';

import { ContentTypeSchema, ContentTypesSchema } from './contentTypes.service.types';

export const getContentTypes = async (): Promise<ContentTypeSchema[] | null> => {
	try {
		const response: ContentTypesSchema = await api.get('content-types').json();

		return response.data;
	} catch (err) {
		console.error(err);
		return null;
	}
};
