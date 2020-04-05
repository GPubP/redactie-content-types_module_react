import { api } from '../api';

import { FieldTypeSchema, FieldTypeSchemaData, FieldTypesSchema } from './fieldTypes.service.types';

export const getFieldTypes = async (): Promise<FieldTypeSchema[] | null> => {
	try {
		const response: any = await api.get('content/field-types').json();

		return response.data;
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const getFieldType = async (uuid: string): Promise<FieldTypeSchemaData | null> => {
	try {
		const response: FieldTypeSchema = await api.get(`content/field-types/${uuid}`).json();

		return response.data;
	} catch (err) {
		console.error(err);
		return null;
	}
};
