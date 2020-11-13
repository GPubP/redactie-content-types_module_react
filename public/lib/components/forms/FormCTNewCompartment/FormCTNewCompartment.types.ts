import { FormikHelpers } from 'formik';

export interface FormCTNewCompartmentState {
	name: string;
}

export interface FormCTNewCompartmentProps {
	formState: FormCTNewCompartmentState;
	onSubmit: (
		formValues: FormCTNewCompartmentState,
		formikHelpers: FormikHelpers<FormCTNewCompartmentState>
	) => void;
	className?: string;
}
