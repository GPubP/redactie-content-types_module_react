import { LanguageSchema } from '@redactie/language-module';

import formRendererConnector from '../../connectors/formRenderer';
import { ContentTypeFieldDetail, Field } from '../../services/contentTypes';
import { FieldType } from '../../services/fieldTypes/fieldTypes.service.types';
import { Preset } from '../../services/presets';
import { fieldsHasMultiLanguage } from '../fieldsHasMultiLanguage';

export const getConfigurationValidation = (
	values: ContentTypeFieldDetail,
	fieldType?: FieldType,
	preset?: Preset,
	languages?: LanguageSchema[]
): Record<string, string> => {
	const validationSchema =
		preset?.validateSchema?.configuration || fieldType?.validateSchema?.configuration || {};
	const errorMessages =
		preset?.errorMessages?.configuration || fieldType?.errorMessages?.configuration || {};
	const validator = new (formRendererConnector.api as any).CustomValidator(
		validationSchema,
		errorMessages,
		{
			allErrors: true,
			messages: true,
		}
	);

	const formFields = !preset
		? fieldType?.data.formSchema?.fields || []
		: preset.data.fields.reduce((acc, field) => {
				return [...acc, ...field.formSchema.fields];
		  }, [] as Field[]);
	const isMultiLanguageForm =
		values.generalConfig.multiLanguage && fieldsHasMultiLanguage(formFields);

	return isMultiLanguageForm && languages?.length
		? languages.reduce((errors, language) => {
				const langValidated = validator.validate(values?.config[language?.key] || {});
				return {
					...errors,
					...(typeof langValidated !== 'object' || !Object.keys(langValidated).length
						? {}
						: { [language.key]: langValidated }),
				};
		  }, {})
		: validator.validate(values?.config || {});
};

export const configurationCompartmentValidator = (
	values: ContentTypeFieldDetail,
	fieldType?: FieldType,
	preset?: Preset,
	languages: LanguageSchema[] = []
): boolean => {
	const validated = getConfigurationValidation(values, fieldType, preset, languages);

	return typeof validated !== 'object' || !Object.keys(validated).length;
};
