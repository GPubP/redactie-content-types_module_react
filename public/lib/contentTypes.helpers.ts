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
