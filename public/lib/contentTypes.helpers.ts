import { pathOr } from 'ramda';

import { CCSettingsFormState } from './contentTypes.types';
import { ContentTypeCreateRequest, ContentTypeFieldSchema } from './services/contentTypes';
import { FieldTypeSchema } from './services/fieldTypes';
import { ContentTypeFieldDetailModel } from './store/contentTypes';

export const generateEmptyContentType = (): ContentTypeCreateRequest => ({
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
): ContentTypeFieldDetailModel => ({
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
	initialValues: Partial<ContentTypeFieldDetailModel> = {}
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
