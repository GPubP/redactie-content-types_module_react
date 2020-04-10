import { FilterFormState } from '../../contentTypes.types';

export interface FilterFormProps {
	initialState: FilterFormState;
	onCancel: () => void;
	onSubmit: (values: FilterFormState) => void;
	deleteActiveFilter: (values: any) => void;
	activeFilters: Array<object>;
}
