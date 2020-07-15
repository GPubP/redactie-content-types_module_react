import { ContentTypeCreateRequest } from '../../services/contentTypes';

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
