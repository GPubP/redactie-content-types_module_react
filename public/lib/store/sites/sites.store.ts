import { StoreConfig } from '@datorama/akita';

import { BaseEntityStore } from '../shared';

import { SiteModel, SitesState } from './sites.model';

@StoreConfig({ name: 'sites', idKey: 'uuid' })
export class SitesStore extends BaseEntityStore<SitesState, SiteModel> {
	constructor() {
		super();
	}
}

export const sitesStore = new SitesStore();
