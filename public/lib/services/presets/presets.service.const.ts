import { SearchParams } from '@redactie/utils';

export const PRESETS_PREFIX_URL = 'content/v1/presets';

export const DEFAULT_PRESETS_SEARCH_PARAMS: SearchParams = {
	page: 1,
	pagesize: -1,
	hidden: false,
	active: true,
};
