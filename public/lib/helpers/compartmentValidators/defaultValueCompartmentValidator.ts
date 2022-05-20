import { LanguageSchema } from '@redactie/language-module';
import { Field, generateErrorMessages, generateSchema } from '@wcm/jsonschema-generator';
import { pathOr } from 'ramda';

import formRendererConnector from '../../connectors/formRenderer';
import {
	ContentTypeFieldDetail,
	ValicationCheckWithAllowedFields,
	ValicationCheckWithFields,
	Validation,
	ValidationCheck,
} from '../../services/contentTypes';
import { FieldType } from '../../services/fieldTypes/fieldTypes.service.types';
import { Preset } from '../../services/presets';
import { fieldsHasMultiLanguage } from '../fieldsHasMultiLanguage';

const getDefaultValueField = (field: ContentTypeFieldDetail): ContentTypeFieldDetail => {
	const filterRequired = (
		checks: (ValidationCheck | ValicationCheckWithFields | ValicationCheckWithAllowedFields)[]
	): (ValidationCheck | ValicationCheckWithFields | ValicationCheckWithAllowedFields)[] => {
		return checks.reduce(
			(
				acc: any,
				check:
					| ValidationCheck
					| ValicationCheckWithFields
					| ValicationCheckWithAllowedFields
			) => {
				const key = pathOr(null, ['key'], check);
				const nestedChecks = pathOr([], ['checks'], check) as ValidationCheck[];
				if (key && key !== 'required') {
					acc.push(check);
				}

				if (nestedChecks.length) {
					acc.push({
						...check,
						checks: nestedChecks.filter(
							(check: ValidationCheck) => check.key !== 'required'
						),
					});
				}

				return acc;
			},
			[] as (ValidationCheck | ValicationCheckWithFields | ValicationCheckWithAllowedFields)[]
		);
	};

	const defaultNotRequired = {
		...field,
		name: 'defaultValue',
		generalConfig: {
			...field.generalConfig,
			min: 0,
			required: false,
		},
		validation: {
			...field.validation,
			checks: filterRequired(field.validation?.checks || []),
		} as Validation,
	};

	// min amount of fields is 1 or more. This doesn't mean that de field is required in a default value context
	// => Remove required props for validation
	if (field.config?.amount?.minValue >= 1) {
		return defaultNotRequired;
	}

	// Return validation as is when it is not required
	if (!field.generalConfig.required) {
		return {
			...field,
			name: 'defaultValue',
		};
	}

	// Do not remove required from validation if field is hidden
	if (field.generalConfig.hidden && field.generalConfig.required) {
		return {
			...field,
			name: 'defaultValue',
		};
	}

	// Field is not hidden but required. This doesn't mean that de field is required in a default value context
	// => Remove required props for validation
	return defaultNotRequired;
};

export const getDefaultValueSchemas = (
	field: ContentTypeFieldDetail,
	fieldType?: FieldType
): {
	validationSchema: Record<string, any>;
	errorMessages: Record<string, any>;
} => {
	const dataTypes = fieldType?.data.dataType ? [fieldType.data.dataType] : [];
	const generateSchemaFieldInput = getDefaultValueField(field);
	const validationSchema = generateSchema(
		[
			({
				...generateSchemaFieldInput,
			} as unknown) as Field,
		],
		dataTypes
	);
	const errorMessages = generateErrorMessages(
		[
			({
				...generateSchemaFieldInput,
			} as unknown) as Field,
		],
		dataTypes
	);

	return { validationSchema, errorMessages };
};

export const getDefaultValueCompartmentValidation = (
	field: ContentTypeFieldDetail,
	fieldType?: FieldType,
	languages?: LanguageSchema[]
): Record<string, string> => {
	const { validationSchema, errorMessages } = getDefaultValueSchemas(field, fieldType);
	const validator = new (formRendererConnector.api as any).CustomValidator(
		validationSchema,
		errorMessages,
		{
			allErrors: true,
			messages: true,
		}
	);
	const formFields =
		!Array.isArray(field.config.fields) || !field.config.fields.length
			? ([] as ContentTypeFieldDetail[])
			: field.config.fields.reduce((acc, f) => {
					return [...acc, f];
			  }, [] as ContentTypeFieldDetail[]);
	const isMultiLanguageForm =
		field.generalConfig.multiLanguage &&
		(!Array.isArray(field.config.fields) ||
			!field.config.fields.length ||
			fieldsHasMultiLanguage(formFields));

	return isMultiLanguageForm && languages?.length
		? languages.reduce((errors, language) => {
				const langValidated = validator.validate(
					{ defaultValue: (field.defaultValue || {})[language.key] } || {}
				);
				return {
					...errors,
					...(typeof langValidated !== 'object' || !Object.keys(langValidated).length
						? {}
						: { [language.key]: langValidated }),
				};
		  }, {})
		: validator.validate({ defaultValue: field.defaultValue } || {});
};

export const defaultValueCompartmentValidator = (
	field: ContentTypeFieldDetail,
	fieldType?: FieldType,
	preset?: Preset,
	languages?: LanguageSchema[]
): boolean => {
	const validated = getDefaultValueCompartmentValidation(field, fieldType, languages);

	return typeof validated !== 'object' || !Object.keys(validated).length;
};
