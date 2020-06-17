import api, { parseSearchParams } from '../api/api.service';
import { SearchParams } from '../api/api.service.types';

import {
	DEFAULT_FIELD_TYPES_SEARCH_PARAMS,
	FIELD_TYPES_PREFIX_URL,
} from './fieldTypes.service.const';
import { FieldTypeSchema, FieldTypeSchemaData } from './fieldTypes.service.types';

export const getFieldTypes = async (
	searchParams: SearchParams = DEFAULT_FIELD_TYPES_SEARCH_PARAMS
): Promise<FieldTypeSchema[] | null> => {
	try {
		const response: any = await api
			.get(`${FIELD_TYPES_PREFIX_URL}?${parseSearchParams(searchParams)}`)
			.json();

		return response.data;
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const getFieldType = async (uuid: string): Promise<FieldTypeSchemaData | null> => {
	try {
		const response: FieldTypeSchema = await api.get(`${FIELD_TYPES_PREFIX_URL}/${uuid}`).json();

		return response.data;
	} catch (err) {
		console.error(err);
		return null;
	}
};
