import { useObservable } from '@mindspace-io/react';

import { LoadingState } from '../../contentTypes.types';
import { PresetModel, presetsFacade } from '../../store/presets';

const usePresets = (): [LoadingState, PresetModel[]] => {
	const [loading] = useObservable(presetsFacade.isFetching$, LoadingState.Loading);
	const [presets] = useObservable(presetsFacade.presets$, []);
	const [error] = useObservable(presetsFacade.error$, null);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, presets];
};

export default usePresets;
