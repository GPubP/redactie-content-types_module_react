import { useEffect, useState } from 'react';

import { FieldTypesSchema } from '../../services/fieldTypes';
import { getFieldTypes } from '../../services/fieldTypes/fieldTypes.service';
import { LoadingState } from '../../types';

const useFieldTypes = (): [LoadingState, FieldTypesSchema | null] => {
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [fieldTypes, setFieldTypes] = useState<FieldTypesSchema | null>(null);

	useEffect(() => {
		setLoadingState(LoadingState.Loading);
		getFieldTypes()
			.then(result => {
				if (Array.isArray(result) && result.length) {
					setFieldTypes(result);
				}

				setLoadingState(LoadingState.Loaded);
			})
			.catch(() => {
				setLoadingState(LoadingState.Error);
			});
	}, []);

	return [loadingState, fieldTypes];
};

export default useFieldTypes;
