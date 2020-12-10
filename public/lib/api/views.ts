import { ContentTypeAPI } from '../contentTypes.types';
import {
	ContentTypesCCConfig,
	ContentTypesCCSettings,
	ContentTypesCCValidation,
} from '../views/tenant';

export const views: ContentTypeAPI['views'] = {
	tenant: {
		ContentTypesCCConfig,
		ContentTypesCCSettings,
		ContentTypesCCValidation,
	},
};
