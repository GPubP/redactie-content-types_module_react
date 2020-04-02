import { api } from '../api';

import { FieldTypesSchema } from './fieldTypes.service.types';

export const getFieldTypes = async (): Promise<FieldTypesSchema | null> => {
	try {
		const response: any = await api.get('field-types').json();

		return response.data;
	} catch (err) {
		console.error(err);
		return null;
	}
};
