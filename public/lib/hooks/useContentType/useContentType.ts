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
	string | null | undefined,
	FieldsByCompartment[] | undefined
] => {
	const isFetching = useObservable(contentTypesFacade.isFetchingOne$, LoadingState.Loading);
	const isUpdating = useObservable(contentTypesFacade.isUpdating$, LoadingState.Loading);
	const isCreating = useObservable(contentTypesFacade.isCreating$, LoadingState.Loading);
	const contentType = useObservable(contentTypesFacade.contentType$, null);
	const fieldsByCompartments = useObservable(contentTypesFacade.fieldsByCompartments$, []);
	const pageTitle = useObservable(
		contentTypesFacade.pageTitle$,
		contentTypesFacade.getPageTitleValue()
	);
	const error = useObservable(contentTypesFacade.error$, null);

	const fetchingState = error ? LoadingState.Error : isFetching;
	const updatingState = error ? LoadingState.Error : isUpdating;
	const creatingState = error ? LoadingState.Error : isCreating;

	return [
		fetchingState,
		updatingState,
		creatingState,
		contentType,
		pageTitle || '',
		fieldsByCompartments,
	];
};

export default useContentType;
