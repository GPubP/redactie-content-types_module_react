import { FieldTypeDetailUIModel } from '../../store/fieldTypes';

export type UseFieldTypesUIStates = () => [
	{ isFetching: boolean; error: any },
	FieldTypeDetailUIModel | undefined
];
