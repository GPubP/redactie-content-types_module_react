import { SearchParams } from '@redactie/utils';

import { PresetDetailModel, PresetDetailUIModel } from '../../store/presets';

export type UseActivePreset = (
	presetId?: string,
	searchParams?: SearchParams
) => [PresetDetailModel | undefined, PresetDetailUIModel | undefined];
