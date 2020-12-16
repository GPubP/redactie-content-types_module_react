import { FORM_CC_SETTINGS_VALIDATION_SCHEMA } from '../../components/forms/FormCCSettings/FormCCSettings.const';
import { ContentTypeFieldDetail } from '../../services/contentTypes';

export const settingsCompartmentValidator = (values: ContentTypeFieldDetail): boolean => {
	return FORM_CC_SETTINGS_VALIDATION_SCHEMA.isValidSync(values);
};
