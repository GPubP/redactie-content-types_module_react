import { isNil } from '@datorama/akita';
import { distinctUntilChanged, filter } from 'rxjs/operators';

import { BaseEntityQuery } from '../shared';

import { SitesState } from './sites.model';
import { SitesStore, sitesStore } from './sites.store';

export class SitesQuery extends BaseEntityQuery<SitesState> {
	constructor(protected store: SitesStore) {
		super(store);
	}

	public meta$ = this.select(state => state.meta).pipe(
		filter(meta => !isNil(meta), distinctUntilChanged())
	);
	public sites$ = this.selectAll();
	public site$ = this.select(state => state.site).pipe(
		filter(site => !isNil(site), distinctUntilChanged())
	);
}

export const sitesQuery = new SitesQuery(sitesStore);
