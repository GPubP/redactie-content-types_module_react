import { SearchParams } from '@redactie/utils';

export const CONTENT_TYPES_PROXY_PREFIX_URL = 'content/v1/content-types';
export const CONTENT_TYPES_PREFIX_URL = 'content/v1/content-types';

export const DEFAULT_CONTENT_TYPES_SEARCH_PARAMS: SearchParams & { skip: number; limit: number } = {
	skip: 0,
	limit: 10,
};
