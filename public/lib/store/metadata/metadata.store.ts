import { StoreConfig } from '@datorama/akita';
import { BaseEntityStore } from '@redactie/utils';

import { MetadataModel, MetadataState } from './metadata.model';

@StoreConfig({ name: 'metadata', idKey: 'uuid' })
export class MetadataStore extends BaseEntityStore<MetadataState, MetadataModel> {
	constructor() {
		super();
	}
}

export const metadataStore = new MetadataStore();
