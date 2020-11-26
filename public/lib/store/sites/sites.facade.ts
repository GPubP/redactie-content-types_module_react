import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { from, Observable } from 'rxjs';

import {
	GetSitesPayload,
	sitesApiService,
	SitesApiService,
	SitesDetailRequestBody,
} from '../../services/sites';
import { BaseEntityFacade } from '../shared';

import { SiteModel, SitesState } from './sites.model';
import { sitesPaginator } from './sites.paginator';
import { SitesQuery, sitesQuery } from './sites.query';
import { SitesStore, sitesStore } from './sites.store';

export class SitesFacade extends BaseEntityFacade<SitesStore, SitesApiService, SitesQuery> {
	constructor(
		store: SitesStore,
		service: SitesApiService,
		query: SitesQuery,
		private paginator: PaginatorPlugin<SitesState>
	) {
		super(store, service, query);
	}

	public readonly meta$ = this.query.meta$;
	public readonly sites$ = this.query.sites$;
	public readonly site$ = this.query.site$;

	public getSitesPaginated(
		payload: GetSitesPayload,
		clearCache = false
	): Observable<PaginationResponse<SiteModel>> {
		if (clearCache) {
			this.paginator.clearCache();
		}

		this.store.setIsFetching(true);

		return from(
			this.service
				.getSites(payload)
				.then(response => {
					if (!response) {
						return;
					}

					this.store.update({
						meta: response.meta,
						isFetching: false,
					});

					return {
						perPage: parseInt(response.meta.size, 10),
						currentPage: parseInt(response.meta.number, 10),
						lastPage: response.meta.totalPages,
						total: response.meta.totalElements,
						data: response.data,
					};
				})
				.catch(error => {
					this.store.update({
						error,
						isFetching: false,
					});
					return error;
				})
		);
	}

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

	public getSite(uuid: string): void {
		const { isFetchingOne, site } = this.query.getValue();
		if (isFetchingOne || site?.uuid === uuid) {
			return;
		}
		this.store.setIsFetchingOne(true);

		this.service
			.getSite(uuid)
			.then(response => {
				if (response) {
					this.store.update({
						site: response,
					});
				}
			})
			.catch(error => this.store.setError(error))
			.finally(() => this.store.setIsFetchingOne(false));
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

export const sitesFacade = new SitesFacade(sitesStore, sitesApiService, sitesQuery, sitesPaginator);
