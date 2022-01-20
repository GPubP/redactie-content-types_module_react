import { ContentTypeAPI } from '../contentTypes.types';
import {
	configurationCompartmentValidator,
	createInitialValuesFromChecks,
	defaultValueCompartmentValidator,
	generateConfig,
	generateConfigFromValidationData,
	generateValidationChecks,
	settingsCompartmentValidator,
	validationCompartmentValidator,
	generateFormSchemaFromPreset,
	generateFormSchemaFromFieldTypeData,
} from '../helpers';

export const helpers: ContentTypeAPI['helpers'] = {
	configurationCompartmentValidator,
	createInitialValuesFromChecks,
	defaultValueCompartmentValidator,
	generateConfig,
	generateConfigFromValidationData,
	generateValidationChecks,
	settingsCompartmentValidator,
	validationCompartmentValidator,
	generateFormSchemaFromPreset,
	generateFormSchemaFromFieldTypeData,
};
