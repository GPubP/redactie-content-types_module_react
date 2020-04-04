import apiService from '../api/api.service';

import {
	SiteSchema,
	SitesDataSchema,
	SitesDetailRequestBody,
	SitesSchema,
} from './sites.service.types';

export const getSites = async (): Promise<SitesDataSchema | null> => {
	try {
		const response: SitesSchema = await apiService.get('sites/v1/sites').json();

		if (!response._embedded) {
			throw new Error('Failed to get sites');
		}

		return {
			meta: response._page,
			data: response._embedded,
		};
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const updateSite = async (id: string, body: SitesDetailRequestBody): Promise<any> => {
	try {
		const response: SiteSchema = await apiService
			.put(`sites/v1/sites/${id}`, { json: body })
			.json();

		if (!response.data) {
			throw new Error(`Failed to update site with id: ${id}`);
		}

		return response;
	} catch (err) {
		console.error(err);
		return null;
	}
};
