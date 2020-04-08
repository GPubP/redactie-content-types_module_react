import { useEffect, useState } from 'react';

import {
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
	ContentTypeSchema | null,
	(contentType: ContentTypeSchema) => Promise<void>,
	(contentType: ContentTypeSchema) => Promise<void>
] => {
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [contentType, setContentType] = useState<ContentTypeSchema | null>(null);

	const localUpdateContentType = (contentType: ContentTypeSchema): Promise<void> => {
		setLoadingState(LoadingState.Loading);

		return updateContentType(contentType).then(response => {
			setContentType(response);
			setLoadingState(LoadingState.Loaded);
		});
	};
	const localCreateContentType = (contentType: ContentTypeSchema): Promise<void> => {
		setLoadingState(LoadingState.Loading);

		return createContentType(contentType).then(response => {
			setContentType(response);
			setLoadingState(LoadingState.Loaded);
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
