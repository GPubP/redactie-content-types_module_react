import { FilterFormState } from './contentTypes.types';
import { ContentTypeSchema } from './services/contentTypes';

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
		canBeFiltered: true,
	},
	modulesConfig: [],
});

export const generateFilterFormState = (): FilterFormState => ({
	name: '',
});
