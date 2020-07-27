import { useObservable } from '@mindspace-io/react';

import { LoadingState } from '../../contentTypes.types';
import { ContentTypeDetailModel, contentTypesFacade } from '../../store/contentTypes';

const useContentType = (): [
	LoadingState,
	LoadingState,
	ContentTypeDetailModel | null | undefined
] => {
	const [isFetching] = useObservable(contentTypesFacade.isFetchingOne$, LoadingState.Loading);
	const [isUpdating] = useObservable(contentTypesFacade.isUpdating$, LoadingState.Loading);
	const [contentType] = useObservable(contentTypesFacade.contentType$, null);
	const [error] = useObservable(contentTypesFacade.error$, null);

	const fetchingState = error ? LoadingState.Error : isFetching;
	const updatingState = error ? LoadingState.Error : isUpdating;

	return [fetchingState, updatingState, contentType];
};

export default useContentType;
