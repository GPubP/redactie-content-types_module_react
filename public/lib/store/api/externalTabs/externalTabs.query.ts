import { QueryEntity } from '@datorama/akita';
import { ContentType } from '@redactie/roles-rights-module/dist/lib/roles.types';
import { from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { CtBaseParams } from '../../../contentTypes.types';
import { ContentTypeDetailResponse } from '../../../services/contentTypes';

import { ExternalTabModel, ExternalTabsState } from './externalTabs.model';
import { ExternalTabsStore, externalTabsStore } from './externalTabs.store';

export class ExternalTabsQuery extends QueryEntity<ExternalTabsState> {
	public all$ = this.selectAll();
	public active$ = this.selectActive();

	constructor(protected store: ExternalTabsStore) {
		super(store);
	}

	public allVisible$ = (
		context: Partial<CtBaseParams>,
		contentType: ContentType | ContentTypeDetailResponse | null
	): Observable<ExternalTabModel[]> =>
		this.selectAll().pipe(
			mergeMap<ExternalTabModel[], Observable<ExternalTabModel[]>>(
				tabs =>
					from<Promise<(ExternalTabModel | null)[]>>(
						Promise.all(
							tabs.map(async tab => {
								if (
									typeof tab.show === 'function' &&
									(await tab.show(context, tab, contentType))
								) {
									return tab;
								}

								if (tab.show !== undefined && !!tab.show) {
									return null;
								}

								return tab;
							})
						)
					).pipe(map(mappedTabs => mappedTabs.filter(tab => tab !== null))) as Observable<
						ExternalTabModel[]
					>
			)
		);
}

export const externalTabsQuery = new ExternalTabsQuery(externalTabsStore);
