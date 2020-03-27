import { ContentTypeSchema, ContentTypesSchema } from './content-types.types';
import apiService from './services/api-service';

export const getContentTypes = async (): Promise<ContentTypeSchema[] | null> => {
	try {
		const response: ContentTypesSchema = await apiService.get('contentTypes').json();

		return response._embedded;
	} catch (err) {
		console.error(err);
		return null;
	}
};
