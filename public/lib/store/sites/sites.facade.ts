import { sitesApiService, SitesApiService, SitesDetailRequestBody } from '../../services/sites';
import { BaseEntityFacade } from '../shared';

import { SitesQuery, sitesQuery } from './sites.query';
import { SitesStore, sitesStore } from './sites.store';

export class SitesFacade extends BaseEntityFacade<SitesStore, SitesApiService, SitesQuery> {
	constructor(store: SitesStore, service: SitesApiService, query: SitesQuery) {
		super(store, service, query);
	}

	public readonly meta$ = this.query.meta$;
	public readonly sites$ = this.query.sites$;

	public getSites(): void {
		const { isFetching } = this.query.getValue();
		if (isFetching) {
			return;
		}
		this.store.setIsFetching(true);

		this.service
			.getSites()
			.then(response => {
				if (response) {
					this.store.update({
						meta: response.meta,
					});
					this.store.set(response.data);
				}
			})
			.catch(error => this.store.setError(error))
			.finally(() => this.store.setIsFetching(false));
	}

	public updateSite(uuid: string, body: SitesDetailRequestBody): void {
		const { isFetchingOne } = this.query.getValue();
		if (isFetchingOne) {
			return;
		}
		this.store.setIsUpdating(true);

		this.service
			.updateSite(uuid, body)
			.then(response => {
				if (response) {
					this.store.update(uuid, site => ({
						...site,
						...response,
					}));
				}
			})
			.catch(error => this.store.setError(error))
			.finally(() => this.store.setIsUpdating(false));
	}
}

export const sitesFacade = new SitesFacade(sitesStore, sitesApiService, sitesQuery);
