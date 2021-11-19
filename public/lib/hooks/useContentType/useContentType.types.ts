import { SiteResponse } from '@redactie/sites-module';
import { LoadingState } from '@redactie/utils';

import { ContentTypeDetailModel, FieldsByCompartment } from '../../store/contentTypes';

export type UseContentTypeResponse = [
	LoadingState,
	LoadingState,
	LoadingState,
	ContentTypeDetailModel | null | undefined,
	FieldsByCompartment[] | undefined,
	LoadingState,
	LoadingState,
	LoadingState,
	SiteResponse[] | null
];
export type UseContentType = () => UseContentTypeResponse;
