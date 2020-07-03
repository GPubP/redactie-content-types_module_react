import api, { parseSearchParams } from '../api/api.service';
import { SearchParams } from '../api/api.service.types';

import {
	DEFAULT_FIELD_TYPES_SEARCH_PARAMS,
	FIELD_TYPES_PREFIX_URL,
} from './fieldTypes.service.const';
import { FieldType, FieldTypeData, FieldTypesResponse } from './fieldTypes.service.types';

export class FieldTypesApiService {
	public async getFieldTypes(
		searchParams: SearchParams = DEFAULT_FIELD_TYPES_SEARCH_PARAMS
	): Promise<FieldType[] | null> {
		try {
			const response: FieldTypesResponse = await api
				.get(`${FIELD_TYPES_PREFIX_URL}?${parseSearchParams(searchParams)}`)
				.json();

			return response.data;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	public async getFieldType(uuid: string): Promise<FieldTypeData | null> {
		try {
			const response: FieldType = await api.get(`${FIELD_TYPES_PREFIX_URL}/${uuid}`).json();

			return response.data;
		} catch (err) {
			console.error(err);
			return null;
		}
	}
}

export const fieldTypesApiService = new FieldTypesApiService();
