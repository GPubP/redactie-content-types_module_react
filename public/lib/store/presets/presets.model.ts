import { Preset, PresetDetail } from '../../services/presets';
import { BaseEntityState } from '../shared';

export type PresetModel = Preset;
export type PresetDetailModel = PresetDetail;

export interface PresetsState extends BaseEntityState<PresetModel, string> {
	preset?: PresetDetailModel;
}
