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
	initialValues: Partial<CCSettingsFormState> = {}
): CCSettingsFormState => ({
	label: '',
	name: '',
	componentName: '',
	dataType: '',
	generalConfig: {
		isQueryable: true,
		isTranslate: true,
		isMultiple: 'false', // Needs to be a string for radio button
	},
	...initialValues,
});
