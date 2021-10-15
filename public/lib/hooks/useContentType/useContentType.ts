import { LoadingState, useObservable } from '@redactie/utils';

import {
	ContentTypeDetailModel,
	contentTypesFacade,
	FieldsByCompartment,
} from '../../store/contentTypes';

const useContentType = (): [
	LoadingState,
	LoadingState,
	LoadingState,
	ContentTypeDetailModel | null | undefined,
	FieldsByCompartment[] | undefined,
	LoadingState
] => {
	const isFetching = useObservable(contentTypesFacade.isFetchingOne$, LoadingState.Loading);
	const isUpdating = useObservable(contentTypesFacade.isUpdating$, LoadingState.Loading);
	const isCreating = useObservable(contentTypesFacade.isCreating$, LoadingState.Loading);
	const contentType = useObservable(contentTypesFacade.contentType$, null);
	const isFetchingSiteModulesConfig = useObservable(
		contentTypesFacade.isFetchingSiteModulesConfig$,
		LoadingState.Loading
	);
	const fieldsByCompartments = useObservable(contentTypesFacade.fieldsByCompartments$, []);
	const error = useObservable(contentTypesFacade.error$, null);

	const fetchingState = error ? LoadingState.Error : isFetching;
	const updatingState = error ? LoadingState.Error : isUpdating;
	const creatingState = error ? LoadingState.Error : isCreating;
	const fetchingSiteModulesConfigState = error ? LoadingState.Error : isFetchingSiteModulesConfig;

	return [
		fetchingState,
		updatingState,
		creatingState,
		contentType,
		fieldsByCompartments,
		fetchingSiteModulesConfigState,
	];
};

export default useContentType;
