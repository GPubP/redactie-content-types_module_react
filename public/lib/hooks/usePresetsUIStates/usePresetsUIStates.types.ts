import { PresetDetailUIModel, PresetUIModel } from '../../store/presets';

export type UsePresetsUIStates = (
	presetId?: string
) => [PresetUIModel, PresetDetailUIModel | undefined];
