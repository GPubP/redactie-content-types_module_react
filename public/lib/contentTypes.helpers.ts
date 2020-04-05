import { ContentTypeCreate } from './services/contentTypes';
import { FieldTypeSchemaData } from './services/fieldTypes';


export const generateEmptyContentType = (): ContentTypeCreate => ({
	fields: [],
	meta: {
		safeLabel: '',
		description: '',
		label: '',
		deleted: false,
	},
});

export const generateCCFormState = (
	initialValues: Partial<FieldTypeSchemaData> = {}
): Partial<FieldTypeSchemaData> => ({
	label: '',
	name: '',
	componentName: '',
	dataType: '',
	generalConfig: {
		isQueryable: false,
		isTranslate: false,
		isMultiple: false,
	},
	...initialValues,
});
