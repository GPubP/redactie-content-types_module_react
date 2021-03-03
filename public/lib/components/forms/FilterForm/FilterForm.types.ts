import { OverviewFilterItem } from '../../../contentTypes.types';

export interface FilterFormState {
	name: string;
}

export interface FilterFormProps {
	initialState: FilterFormState;
	onCancel: () => void;
	onSubmit: (values: FilterFormState) => void;
	deleteActiveFilter: (item: OverviewFilterItem) => void;
	activeFilters: Array<object>;
}
