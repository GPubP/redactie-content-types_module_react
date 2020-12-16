import { PresetDetailModel, PresetDetailUIModel } from '../../store/presets';

export type UsePreset = (
	presetId?: string
) => [PresetDetailModel | undefined, PresetDetailUIModel | undefined];
