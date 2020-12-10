import { useObservable } from '@redactie/utils';

import { presetsFacade } from '../../store/presets';

import { UsePresetsUIStates } from './usePresetsUIStates.types';

const usePresetsUIStates: UsePresetsUIStates = (presetId = '') => {
	const presetUIState = useObservable(presetsFacade.selectUIState(), {
		isFetching: false,
		isCreating: false,
		error: null,
	});
	const presetDetailUIState = useObservable(presetsFacade.selectPresetUIState(presetId));

	return [presetUIState, presetDetailUIState];
};

export default usePresetsUIStates;
