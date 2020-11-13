export interface FormCTNewCompartmentState {
	name: string;
}

export interface FormCTNewCompartmentProps {
	formState: FormCTNewCompartmentState;
	onSubmit: (formValues: FormCTNewCompartmentState) => void;
	className?: string;
}
