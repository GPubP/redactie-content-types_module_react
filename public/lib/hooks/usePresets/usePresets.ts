import { useObservable } from '@mindspace-io/react';

import { presetsFacade } from '../../store/presets';

import { UsePresets } from './usePresets.types';

const usePresets: UsePresets = () => {
	const [loading] = useObservable(presetsFacade.isFetching$, true);
	const [presets] = useObservable(presetsFacade.presets$, []);
	const [error] = useObservable(presetsFacade.listError$, null);

	return [loading, presets, error];
};

export default usePresets;
