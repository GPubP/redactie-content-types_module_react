import { CacheEntityState, CacheEntityUI, CacheEntityUIState } from '@redactie/utils';

import { PresetDetail } from '../../../services/presets';

export type PresetDetailModel = PresetDetail;
export type PresetDetailUIModel = CacheEntityUI;

export type PresetsDetailState = CacheEntityState<PresetDetailModel, string>;

export type PresetsDetailUIState = CacheEntityUIState<PresetDetailUIModel>;
