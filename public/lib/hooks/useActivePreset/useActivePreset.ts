import { useObservable } from '@redactie/utils';
import { useEffect } from 'react';

import { presetsFacade } from '../../store/presets';

import { UseActivePreset } from './useActivePreset.types';

const useActivePreset: UseActivePreset = (presetId?: string) => {
	useEffect(() => {
		if (presetId) {
			if (!presetsFacade.hasActiveDetail(presetId)) {
				presetsFacade.getPreset(presetId);
			}
			presetsFacade.setActiveDetail(presetId);
			return;
		}
		// remove active detail when presetId is undefined
		presetsFacade.removeActiveDetail();
	}, [presetId]);

	const preset = useObservable(presetsFacade.activePreset$);
	const presetUI = useObservable(presetsFacade.activePresetUI$);

	return [preset, presetUI];
};

export default useActivePreset;
