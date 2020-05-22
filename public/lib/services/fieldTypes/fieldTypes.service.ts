import api, { parseSearchParams } from '../api/api.service';
import { SearchParams } from '../api/api.service.types';

import { DEFAULT_FIELD_TYPES_SEARCH_PARAMS } from './fieldTypes.service.const';
import { FieldTypeSchema, FieldTypeSchemaData } from './fieldTypes.service.types';

export const getFieldTypes = async (
	searchParams: SearchParams = DEFAULT_FIELD_TYPES_SEARCH_PARAMS
): Promise<FieldTypeSchema[] | null> => {
	try {
		const response: any = await api
			.get(`content/field-types?${parseSearchParams(searchParams)}`)
			.json();

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
