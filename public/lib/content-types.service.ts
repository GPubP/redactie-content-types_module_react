import { ContentTypeSchema, ContentTypesSchema } from './content-types.types';
import apiService from './services/api-service';

export const getContentTypes = async (): Promise<ContentTypeSchema[] | null> => {
	try {
		const response: ContentTypesSchema = await apiService.get('content-types').json();

		return response._embedded;
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const createSettings = async (body: any): Promise<any | null> => {
	try {
		//const response: any = await apiService.post('content-types', { json: body }).json();
		const response: any = { data: body };

		if (!response.data) {
			throw new Error('Failed to create site');
		}

		return response;
	} catch (err) {
		console.error(err);
		return null;
	}
};
