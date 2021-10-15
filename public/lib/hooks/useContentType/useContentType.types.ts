import { LoadingState } from '@redactie/utils';

import { ContentTypeDetailModel } from '../../..';
import { FieldsByCompartment } from '../../store/contentTypes';

export type UseContentType = () => [
	LoadingState,
	LoadingState,
	LoadingState,
	ContentTypeDetailModel | null | undefined,
	FieldsByCompartment[] | undefined,
	LoadingState
];
