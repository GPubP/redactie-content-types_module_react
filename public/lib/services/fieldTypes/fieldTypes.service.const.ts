import { SearchParams } from '../api/api.service.types';

export const FIELD_TYPES_PREFIX_URL = 'content/v1/proxy/field-types';

export const DEFAULT_FIELD_TYPES_SEARCH_PARAMS: SearchParams = {
	skip: 0,
	limit: -1,
	hidden: false,
};
