import { useObservable } from '@mindspace-io/react';

import { LoadingState } from '../../contentTypes.types';
import { FieldTypeDetailModel, fieldTypesFacade } from '../../store/fieldTypes';

const useFieldType = (): [LoadingState, FieldTypeDetailModel | null | undefined] => {
	const [loading] = useObservable(fieldTypesFacade.isFetchingOne$, LoadingState.Loading);
	const [fieldType] = useObservable(fieldTypesFacade.fieldType$, null);
	const [error] = useObservable(fieldTypesFacade.error$, null);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, fieldType];
};

export default useFieldType;
