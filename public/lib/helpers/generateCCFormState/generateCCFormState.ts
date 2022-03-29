import { pathOr } from 'ramda';

import { CCSettingsFormState } from '../../contentTypes.types';
import { FieldType } from '../../services/fieldTypes/fieldTypes.service.types';
import { ContentTypeFieldDetailModel } from '../../store/contentTypes';

export const generateCCFormState = (
	initialValues: Partial<ContentTypeFieldDetailModel> = {},
	fieldType: FieldType
): CCSettingsFormState => ({
	uuid: initialValues.uuid || '',
	label: initialValues.label || '',
	name: initialValues.name || '',
	defaultValue: initialValues.defaultValue || '',
	generalConfig: {
		guideline: pathOr('', ['generalConfig', 'guideline'], initialValues),
		required: pathOr(true, ['generalConfig', 'required'], initialValues),
		hidden: pathOr(false, ['generalConfig', 'hidden'], initialValues),
		disabled: pathOr(false, ['generalConfig', 'disabled'], initialValues),
		min: pathOr(0, ['generalConfig', 'min'], initialValues),
		max: pathOr(1, ['generalConfig', 'max'], initialValues),
		multiLanguage: pathOr(
			fieldType?.data?.generalConfig.defaultTranslateValue,
			['generalConfig', 'multiLanguage'],
			initialValues
		),
	},
});
