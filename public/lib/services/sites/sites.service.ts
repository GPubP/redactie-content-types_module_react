import apiService from '../api/api.service';

import { Site, SitesData, SitesDetailRequestBody, SitesResponse } from './sites.service.types';

export class SitesApiService {
	public async getSites(): Promise<SitesData | null> {
		try {
			const response: SitesResponse = await apiService.get('sites/v1/sites').json();

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
	}

	public async updateSite(id: string, body: SitesDetailRequestBody): Promise<Site | null> {
		try {
			const response: Site = await apiService
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
	}
}

export const sitesApiService = new SitesApiService();
