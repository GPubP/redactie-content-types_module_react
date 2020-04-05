import { FieldTypeSchemaData } from '../../../services/fieldTypes';

export interface FormCCSettingsProps {
	initialValues: Partial<FieldTypeSchemaData>;
	onSubmit: (formValues: any) => void;
}
