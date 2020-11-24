import { SearchParams } from '../api';

/**
 * =========================
 * Base types
 * =========================
 */

export interface Site {
	uuid: string;
	data: {
		name: string;
		description: string;
		contentTypes: string[];
	};
	meta: {
		tenant: string;
		createdAt: string;
		updatedAt: string;
		active: boolean;
	};
}

export interface SitesData {
	meta: SitesMeta;
	data: Site[];
}

export interface SitesMeta {
	size: string;
	totalElements: number;
	totalPages: number;
	number: string;
}

/**
 * =========================
 * Response types
 * - Define all response interfaces coming from the server
 * =========================
 */

export interface SitesResponse {
	_embedded: Site[];
	_page: SitesMeta;
}

/**
 * =========================
 * Request types
 * - Define all request interfaces that are send to the server
 * =========================
 */

export interface SitesDetailRequestBody {
	name: string;
	description: string;
	contentTypes: string[];
}

export type GetSitesPayload = SearchParams
