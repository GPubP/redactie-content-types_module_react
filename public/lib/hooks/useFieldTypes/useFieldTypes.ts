import { useObservable } from '@redactie/utils';

import { fieldTypesFacade } from '../../store/fieldTypes';

import { UseFieldTypes } from './useFieldTypes.types';

const useFieldTypes: UseFieldTypes = () => {
	const loading = useObservable(fieldTypesFacade.isFetching$, true);
	const fieldTypes = useObservable(fieldTypesFacade.fieldTypes$, []);
	const error = useObservable(fieldTypesFacade.listError$, null);

	return [loading, fieldTypes, error];
};

export default useFieldTypes;
