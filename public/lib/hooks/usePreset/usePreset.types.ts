import { SearchParams } from '@redactie/utils';

import { PresetDetailModel, PresetDetailUIModel } from '../../store/presets';

export type UsePreset = (
	presetId?: string,
	searchParams?: SearchParams
) => [PresetDetailModel | undefined, PresetDetailUIModel | undefined];
