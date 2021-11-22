import { SiteResponse } from '@redactie/sites-module';
import { LoadingState } from '@redactie/utils';

import { ContentTypeDetailModel, FieldsByCompartment } from '../../store/contentTypes';

export type UseContentTypeResponse = {
	fetchingState: LoadingState;
	updatingState: LoadingState;
	creatingState: LoadingState;
	removingState: LoadingState;
	fetchingSiteModulesConfigState: LoadingState;
	contentType: ContentTypeDetailModel | null | undefined;
	fieldsByCompartments: FieldsByCompartment[] | undefined;
	isFetchingSiteOccurrencesState: LoadingState;
	siteOccurrences: SiteResponse[] | null;
};
export type UseContentType = () => UseContentTypeResponse;
