import { NewCCFormState } from '../../../contentTypes.types';

export interface FormCTNewCCProps {
	fieldTypeOptions: {
		key: string;
		label: string;
		value: string;
	}[];
	compartmentOptions?: {
		key: string;
		label: string;
		value: string;
	}[];
	formState: NewCCFormState;
	onSubmit: (formValues: NewCCFormState) => void;
	hasName?: boolean;
	className?: string;
	[elementProp: string]: unknown;
}
