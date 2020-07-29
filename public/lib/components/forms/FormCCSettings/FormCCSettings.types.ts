import { CCSettingsFormState } from '../../../contentTypes.types';
import { FieldTypeData } from '../../../services/fieldTypes/fieldTypes.service.types';

export interface FormCCSettingsProps {
	initialValues: CCSettingsFormState | undefined;
	inputValues: CCSettingsFormState;
	fieldTypeData: FieldTypeData;
	onSubmit: (formValues: CCSettingsFormState) => void;
	isUpdate: boolean;
}
