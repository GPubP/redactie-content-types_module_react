import { ContentTypeAPI } from '../contentTypes.types';
import {
	configurationCompartmentValidator,
	defaultValueCompartmentValidator,
	generateConfig,
	generateValidationChecks,
	settingsCompartmentValidator,
	validationCompartmentValidator,
} from '../helpers';

export const helpers: ContentTypeAPI['helpers'] = {
	generateConfig,
	generateValidationChecks,
	configurationCompartmentValidator,
	defaultValueCompartmentValidator,
	settingsCompartmentValidator,
	validationCompartmentValidator,
};
