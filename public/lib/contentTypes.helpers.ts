import { is, omit, pathOr } from 'ramda';

import { CCSettingsFormState } from './contentTypes.types';
import {
	ContentTypeCreate,
	ContentTypeFieldResponse,
	ContentTypeFieldSchema,
} from './services/contentTypes';
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

export const generateFieldFromType = (
	fieldType: FieldTypeSchemaData,
	initialValues: Partial<ContentTypeFieldSchema> = {}
): ContentTypeFieldSchema => ({
	label: '',
	module: fieldType.module || '',
	name: '',
	dataType: fieldType.dataType || '',
	fieldType: '',
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
});

export const generateCCFormState = (
	initialValues: Partial<ContentTypeFieldSchema> = {}
): CCSettingsFormState => ({
	label: initialValues.label || '',
	name: initialValues.name || '',
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

export const parseContentTypeField = (
	field: ContentTypeFieldResponse | ContentTypeFieldSchema
): ContentTypeFieldSchema => {
	const dataType = is(String, field.dataType)
		? (field.dataType as string)
		: (field as ContentTypeFieldResponse).dataType._id;
	const fieldType = is(String, field.fieldType)
		? (field.fieldType as string)
		: (field as ContentTypeFieldResponse).fieldType._id || '';
	return {
		...omit(['dataType', 'fieldType'], field),
		dataType,
		fieldType,
	};
};
