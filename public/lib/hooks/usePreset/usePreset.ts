import { useEffect, useState } from 'react';

import { PresetDetailModel, PresetDetailUIModel, presetsFacade } from '../../store/presets';

import { UsePreset } from './usePreset.types';

const usePreset: UsePreset = (presetId?: string) => {
	const [preset, setPreset] = useState<PresetDetailModel>();
	const [presetUI, setPresetUI] = useState<PresetDetailUIModel>();
	useEffect(() => {
		if (!presetId) {
			return;
		}

		const hasPreset = presetsFacade.hasPreset(presetId);

		if (!hasPreset) {
			presetsFacade.getPreset(presetId);
		}

		const presetSubscription = presetsFacade.selectPreset(presetId).subscribe(setPreset);
		const presetUISubscription = presetsFacade
			.selectPresetUIState(presetId)
			.subscribe(setPresetUI);

		return () => {
			presetSubscription.unsubscribe();
			presetUISubscription.unsubscribe();
		};
	}, [presetId]);

	return [preset, presetUI];
};

export default usePreset;
