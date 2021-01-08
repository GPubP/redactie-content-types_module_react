import { StoreConfig } from '@datorama/akita';
import { CacheEntityStore } from '@redactie/utils';

import {
	PresetDetailModel,
	PresetsDetailState,
	PresetsDetailUIState,
} from './presets-detail.model';

@StoreConfig({ name: 'content-types-presets-detail', idKey: 'uuid', resettable: true })
export class PresetsDetailStore extends CacheEntityStore<
	PresetsDetailUIState,
	PresetsDetailState,
	PresetDetailModel
> {}

export const presetsDetailStore = new PresetsDetailStore(
	{},
	{
		isActivating: false,
	}
);
