import { useEffect, useState } from 'react';

import { FieldTypeSchemaData, getFieldType } from '../../services/fieldTypes';
import { LoadingState } from '../../types';

const useFieldType = (
	uuid: string | undefined,
	overrides: Partial<FieldTypeSchemaData> = {}
): [LoadingState, FieldTypeSchemaData | null] => {
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [fieldType, setFieldType] = useState<FieldTypeSchemaData | null>(null);

	useEffect(() => {
		if (loadingState === LoadingState.Loaded && fieldType) {
			return;
		}

		if (!uuid) {
			return setLoadingState(LoadingState.Error);
		}

		getFieldType(uuid)
			.then(result => {
				if (result) {
					setFieldType({ ...result, ...overrides });
				}

				setLoadingState(LoadingState.Loaded);
			})
			.catch(() => {
				setLoadingState(LoadingState.Error);
			});
	}, [fieldType, loadingState, overrides, uuid]);

	return [loadingState, fieldType];
};

export default useFieldType;
