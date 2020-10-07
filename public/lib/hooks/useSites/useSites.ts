import { useObservable } from '@mindspace-io/react';

import { LoadingState } from '../../contentTypes.types';
import { SiteModel, sitesFacade } from '../../store/sites';

const useSites = (): [LoadingState, SiteModel[]] => {
	const [loading] = useObservable(sitesFacade.isFetching$, LoadingState.Loading);
	const [sites] = useObservable(sitesFacade.sites$, []);
	const [error] = useObservable(sitesFacade.error$, null);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, sites];
};

export default useSites;
