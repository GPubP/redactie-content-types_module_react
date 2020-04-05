import { ContentTypeSchema } from './services/contentTypes';
import { FieldTypeSchemaData } from './services/fieldTypes';

export const generateSettingsFormState = (): ContentTypeSchema => ({
	_id: '',
	fields: [],
	meta: {
		created: '',
		lastModified: '',
		taxonomy: {
			available: [],
			fieldType: 'taxonomy',
			tags: [],
		},
		deleted: false,
		lastEditor: '',
		safeLabel: '',
		description: '',
		label: '',
	},
	uuid: 'e',
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
