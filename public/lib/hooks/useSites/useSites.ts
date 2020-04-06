import { useEffect, useState } from 'react';

import { getSites, SitesDataSchema } from '../../services/sites';
import { LoadingState } from '../../types';

const useSites = (): [LoadingState, SitesDataSchema | null] => {
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [sites, setSites] = useState<SitesDataSchema | null>(null);

	useEffect(() => {
		setLoadingState(LoadingState.Loading);
		getSites()
			.then(result => {
				if (result?.data.length) {
					setSites(result);
				}
				setLoadingState(LoadingState.Loaded);
			})
			.catch(() => {
				setLoadingState(LoadingState.Error);
			});
	}, []);

	return [loadingState, sites];
};

export default useSites;
