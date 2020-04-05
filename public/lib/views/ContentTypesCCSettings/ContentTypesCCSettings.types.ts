import { FieldTypeSchemaData } from '../../services/fieldTypes';

export interface ContentTypesCCSettingsProps {
	fieldFormState: Partial<FieldTypeSchemaData>;
	onSubmit: (data: any) => void;
}
