import { ContentTypeSchema, ContentTypesSchema } from './content-types.types';
import apiService from './services/api-service';

export const getContentTypes = async (): Promise<ContentTypeSchema[] | null> => {
	try {
		const response: ContentTypesSchema = await apiService.get('content-types').json();
		return response.data;
	} catch (err) {
		console.error(err);
		return null;
	}
};
