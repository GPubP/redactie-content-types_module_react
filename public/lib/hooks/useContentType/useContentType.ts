import { LoadingState, useObservable } from '@redactie/utils';

import { contentTypesFacade } from '../../store/contentTypes';

import { UseContentTypeResponse } from './useContentType.types';

const useContentType = (): UseContentTypeResponse => {
	const isFetching = useObservable(contentTypesFacade.isFetchingOne$, LoadingState.Loading);
	const isUpdating = useObservable(contentTypesFacade.isUpdating$, LoadingState.Loading);
	const isCreating = useObservable(contentTypesFacade.isCreating$, LoadingState.Loading);
	const isRemoving = useObservable(contentTypesFacade.isRemoving$, LoadingState.Loading);
	const isFetchingSiteOccurrences = useObservable(
		contentTypesFacade.isFetchingSiteOccurrences$,
		LoadingState.Loading
	);
	const contentType = useObservable(contentTypesFacade.contentType$, null);
	const siteOccurrences = useObservable(contentTypesFacade.siteOccurrences$, null);
	const isFetchingSiteModulesConfig = useObservable(
		contentTypesFacade.isFetchingSiteModulesConfig$,
		LoadingState.Loading
	);
	const fieldsByCompartments = useObservable(contentTypesFacade.fieldsByCompartments$, []);
	const error = useObservable(contentTypesFacade.error$, null);

	const fetchingState = error ? LoadingState.Error : isFetching;
	const updatingState = error ? LoadingState.Error : isUpdating;
	const creatingState = error ? LoadingState.Error : isCreating;
	const removingState = error ? LoadingState.Error : isRemoving;
	const isFetchingSiteOccurrencesState = error ? LoadingState.Error : isFetchingSiteOccurrences;
	const fetchingSiteModulesConfigState = error ? LoadingState.Error : isFetchingSiteModulesConfig;

	return {
		fetchingState,
		updatingState,
		creatingState,
		removingState,
		contentType,
		fieldsByCompartments,
		fetchingSiteModulesConfigState,
		isFetchingSiteOccurrencesState,
		siteOccurrences,
	};
};

export default useContentType;
