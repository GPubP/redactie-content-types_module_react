export interface FormCTEditCompartmentState {
	name: string;
}

export interface FormCTEditCompartmentProps {
	formState: FormCTEditCompartmentState;
	className?: string;
	isLoading: boolean;
	isRemovable: boolean;
	onSubmit: (formValues: FormCTEditCompartmentState) => void;
	onDelete?: () => void;
	onCancel: () => void;
}
