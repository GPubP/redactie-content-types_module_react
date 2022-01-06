import { FormikHelpers } from 'formik';

import { Compartment } from '../../../services/contentTypes';

export interface FormCTNewCompartmentState {
	name: string;
}

export interface FormCTNewCompartmentProps {
	formState: FormCTNewCompartmentState;
	compartments: Compartment[];
	onSubmit: (
		formValues: FormCTNewCompartmentState,
		formikHelpers: FormikHelpers<FormCTNewCompartmentState>
	) => void;
	className?: string;
}
