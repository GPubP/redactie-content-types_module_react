import { api } from '../api';

import { FieldTypeSchema } from './fieldTypes.service.types';

export const getFieldTypes = async (): Promise<FieldTypeSchema[] | null> => {
	try {
		const response: any = await api.get('content/field-types').json();

		return response.data;
	} catch (err) {
		console.error(err);
		return null;
	}
};
