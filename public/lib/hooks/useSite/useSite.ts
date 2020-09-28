import { useObservable } from '@mindspace-io/react';

import { LoadingState } from '../../contentTypes.types';
import { SiteModel, sitesFacade } from '../../store/sites';

const useSite = (): [LoadingState, SiteModel | null | undefined] => {
	const [loading] = useObservable(sitesFacade.isFetchingOne$, LoadingState.Loading);
	const [site] = useObservable(sitesFacade.site$, null);
	const [error] = useObservable(sitesFacade.error$, null);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, site];
};

export default useSite;
