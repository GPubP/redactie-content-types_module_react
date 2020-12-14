import { useObservable } from '@redactie/utils';
import { useEffect, useState } from 'react';

import { PresetDetailUIModel, presetsFacade } from '../../store/presets';

import { UsePresetsUIStates } from './usePresetsUIStates.types';

const usePresetsUIStates: UsePresetsUIStates = (presetId = '') => {
	const presetUIState = useObservable(presetsFacade.UIState$, {
		isFetching: false,
		isCreating: false,
		error: null,
	});
	const [presetDetailUIState, setPresetDetailUIState] = useState<PresetDetailUIModel>();

	useEffect(() => {
		const s = presetsFacade.selectPresetUIState(presetId).subscribe(setPresetDetailUIState);

		return () => {
			s.unsubscribe();
		};
	}, [presetId]);

	return [presetUIState, presetDetailUIState];
};

export default usePresetsUIStates;
