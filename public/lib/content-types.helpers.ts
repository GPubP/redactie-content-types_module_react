import { FilterFormState } from './contentTypes.types';
import { ContentTypeModel } from './store/contentTypes';

export const generateSettingsFormState = (): ContentTypeModel => ({
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
