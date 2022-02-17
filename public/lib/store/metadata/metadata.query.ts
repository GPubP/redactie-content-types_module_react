import { BaseEntityQuery } from '@redactie/utils';

import { MetadataState } from './metadata.model';
import { metadataStore, MetadataStore } from './metadata.store';

export class MetadataQuery extends BaseEntityQuery<MetadataState> {
	constructor(protected store: MetadataStore) {
		super(store);
	}

	public metadata$ = this.selectAll();
}

export const metadataQuery = new MetadataQuery(metadataStore);
