import { useObservable } from '@mindspace-io/react';

import { LoadingState } from '../../contentTypes.types';
import { ContentTypeDetailModel, contentTypesFacade } from '../../store/contentTypes';

const useContentType = (): [LoadingState, ContentTypeDetailModel | null | undefined] => {
	const [loading] = useObservable(contentTypesFacade.isFetchingOne$, LoadingState.Loading);
	const [contentType] = useObservable(contentTypesFacade.contentType$, null);
	const [error] = useObservable(contentTypesFacade.error$, null);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, contentType];
};

export default useContentType;
