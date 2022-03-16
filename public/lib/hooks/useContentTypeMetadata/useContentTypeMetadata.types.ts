import { LoadingState } from '@redactie/utils';

export type UseContentTypeMetadataResponse = {
	updatingState: LoadingState;
	creatingState: LoadingState;
};
export type UseContentTypeMetadata = () => UseContentTypeMetadataResponse;
