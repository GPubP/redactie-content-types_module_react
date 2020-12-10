import { useObservable } from '@redactie/utils';
import { useEffect } from 'react';

import { presetsFacade } from '../../store/presets';

import { UseActivePreset } from './useActivePreset.types';

const useActivePreset: UseActivePreset = (presetId?: string) => {
	useEffect(() => {
		if (presetId) {
			const hasPreset = presetsFacade.hasPreset(presetId);
			if (hasPreset && presetsFacade.hasActivePreset(presetId)) {
				return;
			}

			if (!hasPreset) {
				presetsFacade
					.getPreset(presetId)
					.then(() => presetsFacade.setActivePreset(presetId));
				return;
			}

			presetsFacade.setActivePreset(presetId);
			return;
		}
		// remove active Preset when presetId is undefined
		presetsFacade.removeActivePreset();
	}, [presetId]);

	const preset = useObservable(presetsFacade.activePreset$);
	const presetUI = useObservable(presetsFacade.activePresetUI$);

	return [preset, presetUI];
};

export default useActivePreset;
