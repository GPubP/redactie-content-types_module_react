import { CacheEntityState, CacheEntityUI, CacheEntityUIState } from '@redactie/utils';

import { PresetDetailField, PresetDetailResponse } from '../../../services/presets';

export type PresetDetailModel = PresetDetailResponse;
export type PresetDetailFieldModel = PresetDetailField;
export interface PresetDetailUIModel extends CacheEntityUI {
	isActivating: boolean;
}

export type PresetsDetailState = CacheEntityState<PresetDetailModel, string>;

export type PresetsDetailUIState = CacheEntityUIState<PresetDetailUIModel>;
