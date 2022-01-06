import { Compartment } from "../../../services/contentTypes";

export interface FormCTEditCompartmentState {
	name: string;
}

export interface FormCTEditCompartmentProps {
	formState: FormCTEditCompartmentState;
	className?: string;
	isLoading: boolean;
	isRemovable: boolean;
	compartments: Compartment[];
	onSubmit: (formValues: FormCTEditCompartmentState) => void;
	onDelete?: () => void;
	onCancel: () => void;
}
