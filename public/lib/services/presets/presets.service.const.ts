import { SearchParams } from '../api/api.service.types';

export const PRESETS_PREFIX_URL = 'content/v1/proxy/presets';

export const DEFAULT_PRESETS_SEARCH_PARAMS: SearchParams = {
	skip: 0,
	limit: -1,
	hidden: false,
};
