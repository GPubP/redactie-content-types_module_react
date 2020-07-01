import { useObservable } from '@mindspace-io/react';

import { ContentTypeDetailModel, contentTypesFacade } from '../../store/contentTypes';
import { LoadingState } from '../../types';

const useContentType = (): [LoadingState, ContentTypeDetailModel | null | undefined] => {
	const [loading] = useObservable(contentTypesFacade.isFetching$, LoadingState.Loading);
	const [contentType] = useObservable(contentTypesFacade.contentType$, null);
	const [error] = useObservable(contentTypesFacade.error$, null);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, contentType];
};

export default useContentType;
