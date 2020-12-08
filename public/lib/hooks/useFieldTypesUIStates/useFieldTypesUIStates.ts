import { useObservable } from '@redactie/utils';

import { fieldTypesFacade } from '../../store/fieldTypes';

import { UseFieldTypesUIStates } from './useFieldTypesUIStates.types';

const useFieldTypesUIStates: UseFieldTypesUIStates = (fieldTypeId = '') => {
	const error = useObservable(fieldTypesFacade.listError$, null);
	const isFetching = useObservable(fieldTypesFacade.isFetching$, false);
	const fieldTypeDetailUIState = useObservable(
		fieldTypesFacade.selectFieldTypeUIState(fieldTypeId)
	);

	return [
		{
			error,
			isFetching,
		},
		fieldTypeDetailUIState,
	];
};

export default useFieldTypesUIStates;
