import { StoreConfig } from '@datorama/akita';

import { BaseEntityStore } from '../shared';

import { PresetModel, PresetsState } from './presets.model';

@StoreConfig({ name: 'presets', idKey: 'uuid' })
export class PresetsStore extends BaseEntityStore<PresetsState, PresetModel> {
	constructor() {
		super();
	}
}

export const presetsStore = new PresetsStore();
