import { pathOr, toString } from 'ramda';

import { CCSettingsFormState } from './contentTypes.types';
import { ContentTypeCreate } from './services/contentTypes';

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
	initialValues: Partial<CCSettingsFormState<boolean>> = {}
): CCSettingsFormState => ({
	label: initialValues.label || '',
	name: initialValues.name || '',
	generalConfig: {
		isQueryable: !pathOr(true, ['generalConfig', 'isQueryable'], initialValues), // Invert value because of input label
		isTranslate: pathOr(true, ['generalConfig', 'isTranslate'], initialValues),
		isMultiple: toString(pathOr(false, ['generalConfig', 'isMultiple'], initialValues)), // Needs to be a string for radio button
	},
});
