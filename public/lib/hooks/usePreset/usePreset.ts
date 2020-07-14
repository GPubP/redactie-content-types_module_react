import { useObservable } from '@mindspace-io/react';

import { LoadingState } from '../../contentTypes.types';
import { PresetDetailModel, presetsFacade } from '../../store/presets';

const usePreset = (): [LoadingState, PresetDetailModel | null | undefined] => {
	const [loading] = useObservable(presetsFacade.isFetchingOne$, LoadingState.Loading);
	const [preset] = useObservable(presetsFacade.preset$, null);
	const [error] = useObservable(presetsFacade.error$, null);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, preset];
};

export default usePreset;
