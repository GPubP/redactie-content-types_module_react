import { useEffect, useState } from 'react';

import { SearchParams } from '../../services/api';
import { ContentTypeResponse, getContentTypes } from '../../services/contentTypes';
import { LoadingState } from '../../types';

const useContentTypes = (
	searchParams: SearchParams
): [LoadingState, ContentTypeResponse[] | null] => {
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [contentTypes, setContentTypes] = useState<ContentTypeResponse[] | null>(null);

	useEffect(() => {
		getContentTypes(searchParams)
			.then(result => {
				if (result) {
					setContentTypes(result);
				}
				setLoadingState(LoadingState.Loaded);
			})
			.catch(() => {
				setLoadingState(LoadingState.Error);
			});
	}, [searchParams]);

	return [loadingState, contentTypes];
};

export default useContentTypes;
