import { FilterFormState } from '../../contentTypes.types';

export interface FilterFormProps {
	initialState: FilterFormState;
	onCancel: () => void;
	onSubmit: (values: FilterFormState) => void;
	deleteActiveFilter: () => void;
	activeFilters: Array<object>;
}
