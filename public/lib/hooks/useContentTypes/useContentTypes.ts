import { useEffect, useState } from 'react';

import { SearchParams } from '../../services/api';
import { ContentTypesDataSchema, getContentTypes } from '../../services/contentTypes';
import { LoadingState } from '../../types';

const useContentTypes = (
	searchParams: SearchParams
): [LoadingState, ContentTypesDataSchema | null] => {
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [contentTypes, setContentTypes] = useState<ContentTypesDataSchema | null>(null);

	useEffect(() => {
		getContentTypes(searchParams)
			.then(result => {
				if (result?.data.length) {
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
