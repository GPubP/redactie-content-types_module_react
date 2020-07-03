import { useObservable } from '@mindspace-io/react';

import { LoadingState } from '../../contentTypes.types';
import { FieldTypeModel, fieldTypesFacade } from '../../store/fieldTypes';

const useFieldTypes = (): [LoadingState, FieldTypeModel[]] => {
	const [loading] = useObservable(fieldTypesFacade.isFetching$, LoadingState.Loading);
	const [fieldTypes] = useObservable(fieldTypesFacade.fieldTypes$, []);
	const [error] = useObservable(fieldTypesFacade.error$, null);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, fieldTypes];
};

export default useFieldTypes;
