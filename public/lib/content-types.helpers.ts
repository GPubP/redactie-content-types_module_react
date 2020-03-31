import { ContentTypeSchema } from './content-types.types';

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
