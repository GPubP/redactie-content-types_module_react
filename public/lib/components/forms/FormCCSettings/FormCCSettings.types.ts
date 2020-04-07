import { CCSettingsFormState } from '../../../contentTypes.types';

export interface FormCCSettingsProps {
	initialValues: CCSettingsFormState;
	onSubmit: (formValues: CCSettingsFormState<boolean>) => void;
}
