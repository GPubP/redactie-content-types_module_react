import { pathOr } from 'ramda';

import { CCSettingsFormState } from './contentTypes.types';
import { ContentTypeCreate, ContentTypeFieldSchema } from './services/contentTypes';
import { FieldTypeSchema } from './services/fieldTypes';
import { ContentTypeField } from './store/internal';

export const generateEmptyContentType = (): ContentTypeCreate => ({
	fields: [],
	modulesConfig: [],
	meta: {
		safeLabel: '',
		description: '',
		label: '',
		deleted: false,
	},
});

export const generateFieldFromType = (
	fieldType: FieldTypeSchema,
	initialValues: Partial<ContentTypeFieldSchema> = {}
): ContentTypeField => ({
	label: '',
	module: fieldType.data.module || '',
	name: '',
	config: {},
	validators: [],
	operators: [],
	generalConfig: {
		required: true,
		hidden: false,
		min: 0,
		max: 1,
	},
	...initialValues,
	dataType: fieldType.data.dataType,
	fieldType,
});

export const generateCCFormState = (
	initialValues: Partial<ContentTypeField> = {}
): CCSettingsFormState => ({
	label: initialValues.label || '',
	name: initialValues.name || '',
	defaultValue: initialValues.defaultValue || '',
	config: {
		guideline: pathOr('', ['config', 'guideline'], initialValues),
	},
	generalConfig: {
		required: pathOr(true, ['generalConfig', 'required'], initialValues),
		hidden: pathOr(false, ['generalConfig', 'hidden'], initialValues),
		min: pathOr(0, ['generalConfig', 'min'], initialValues),
		max: pathOr(1, ['generalConfig', 'max'], initialValues),
	},
});

export const parseContentTypeField = (field: ContentTypeField): ContentTypeFieldSchema => {
	return {
		...field,
		dataType: field.dataType._id,
		fieldType: field.fieldType?._id,
	};
};
