import { LoadingState, useObservable } from '@redactie/utils';

import { contentTypesFacade } from '../../store/contentTypes';
import { metadataFacade } from '../../store/metadata';

import { UseContentTypeMetadataResponse } from './useContentTypeMetadata.types';

const useContentTypeMetadata = (): UseContentTypeMetadataResponse => {
	const isUpdating = useObservable(metadataFacade.isUpdating$, LoadingState.Loading);
	const isCreating = useObservable(metadataFacade.isCreating$, LoadingState.Loading);

	const error = useObservable(contentTypesFacade.error$, null);

	const updatingState = error ? LoadingState.Error : isUpdating;
	const creatingState = error ? LoadingState.Error : isCreating;

	return {
		updatingState,
		creatingState,
	};
};

export default useContentTypeMetadata;
