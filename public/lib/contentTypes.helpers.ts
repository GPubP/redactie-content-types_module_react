import { pathOr } from 'ramda';

import { CCSettingsFormState } from './contentTypes.types';
import { ContentTypeCreateRequest } from './services/contentTypes';
import { Preset, PresetDetail } from './services/presets';
import { ContentTypeFieldDetailModel } from './store/contentTypes';
import { FieldTypeModel } from './store/fieldTypes';

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
	fieldType: FieldTypeModel,
	initialValues: Partial<ContentTypeFieldDetailModel> = {},
	preset?: Preset | PresetDetail
): ContentTypeFieldDetailModel => ({
	uuid: `new_${Math.random()
		.toString(36)
		.substr(2, 9)}`,
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
	preset,
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
