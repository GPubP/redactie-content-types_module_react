import { useObservable } from '@redactie/utils';
import { useEffect, useState } from 'react';

import { FieldTypeDetailUIModel, fieldTypesFacade } from '../../store/fieldTypes';

import { UseFieldTypesUIStates } from './useFieldTypesUIStates.types';

const useFieldTypesUIStates: UseFieldTypesUIStates = (fieldTypeId = '') => {
	const error = useObservable(fieldTypesFacade.listError$, null);
	const isFetching = useObservable(fieldTypesFacade.isFetching$, false);
	const [fieldTypeDetailUIState, setFieldTypeDetailUIState] = useState<FieldTypeDetailUIModel>();

	useEffect(() => {
		const s = fieldTypesFacade
			.selectFieldTypeUIState(fieldTypeId)
			.subscribe(setFieldTypeDetailUIState);
		return () => {
			s.unsubscribe();
		};
	}, [fieldTypeId]);

	return [
		{
			error,
			isFetching,
		},
		fieldTypeDetailUIState,
	];
};

export default useFieldTypesUIStates;
