import api, { parseSearchParams } from '../api/api.service';
import { SearchParams } from '../api/api.service.types';

import {
	DEFAULT_FIELD_TYPES_SEARCH_PARAMS,
	FIELD_TYPES_PREFIX_URL,
} from './fieldTypes.service.const';
import { FieldType, FieldTypesResponse } from './fieldTypes.service.types';

export class FieldTypesApiService {
	public async getFieldTypes(
		searchParams: SearchParams = DEFAULT_FIELD_TYPES_SEARCH_PARAMS
	): Promise<FieldTypesResponse | null> {
		return await api.get(`${FIELD_TYPES_PREFIX_URL}?${parseSearchParams(searchParams)}`).json();
	}

	public async getFieldType(uuid: string): Promise<FieldType | null> {
		return await api.get(`${FIELD_TYPES_PREFIX_URL}/${uuid}`).json();
	}
}

export const fieldTypesApiService = new FieldTypesApiService();
