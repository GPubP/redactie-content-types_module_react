import { useEffect, useState } from 'react';

import {
	ContentTypeResponse,
	ContentTypeSchema,
	createContentType,
	getContentType,
	updateContentType,
} from '../../services/contentTypes';
import { LoadingState } from '../../types';

const useContentType = (
	uuid: string | null = null
): [
	LoadingState,
	ContentTypeResponse | null,
	(contentType: ContentTypeSchema) => Promise<void>,
	(contentType: ContentTypeSchema) => Promise<void>
] => {
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [contentType, setContentType] = useState<ContentTypeResponse | null>(null);

	const localUpdateContentType = (contentType: ContentTypeSchema): Promise<void> => {
		setLoadingState(LoadingState.Loading);

		return updateContentType(contentType)
			.then(() => {
				setLoadingState(LoadingState.Loaded);
			})
			.catch(() => {
				setLoadingState(LoadingState.Error);
			});
	};
	const localCreateContentType = (contentType: ContentTypeSchema): Promise<void> => {
		setLoadingState(LoadingState.Loading);

		return createContentType(contentType)
			.then(() => {
				setLoadingState(LoadingState.Loaded);
			})
			.catch(() => {
				setLoadingState(LoadingState.Error);
			});
	};

	useEffect(() => {
		if (!uuid) {
			return setLoadingState(LoadingState.Error);
		}

		setLoadingState(LoadingState.Loading);
		getContentType(uuid as string)
			.then(result => {
				if (result) {
					setContentType(result);
				}

				setLoadingState(LoadingState.Loaded);
			})
			.catch(() => {
				setLoadingState(LoadingState.Error);
			});
	}, [uuid]);

	return [loadingState, contentType, localUpdateContentType, localCreateContentType];
};

export default useContentType;
