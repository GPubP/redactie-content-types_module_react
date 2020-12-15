import { ContentTypeAPI } from '../contentTypes.types';
import { generateConfig, generateValidationChecks } from '../helpers';

export const helpers: ContentTypeAPI['helpers'] = {
	generateConfig,
	generateValidationChecks,
};
