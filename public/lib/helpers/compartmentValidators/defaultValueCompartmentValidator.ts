import { Field, generateErrorMessages, generateSchema } from '@wcm/jsonschema-generator';
import { isEmpty, pathOr } from 'ramda';

import formRendererConnector from '../../connectors/formRenderer';
import { ContentTypeFieldDetail, ValicationCheckWithAllowedFields, ValicationCheckWithFields, Validation, ValidationCheck } from '../../services/contentTypes';
import { FieldType } from '../../services/fieldTypes/fieldTypes.service.types';

const getDefaultValueField = (field: ContentTypeFieldDetail): ContentTypeFieldDetail => {
	const filterRequired = (checks: (ValidationCheck | ValicationCheckWithFields | ValicationCheckWithAllowedFields)[]) => {
		return checks.map((check) => {
			const key = pathOr(null, ['key'], check)
			const nestedChecks = pathOr([], ['checks'], check) as ValidationCheck[]
			if(key && key !== 'required') {
				return check;
			}

			if(nestedChecks.length) {
				return {
					...check,
					checks: (nestedChecks).filter((check: ValidationCheck) => check.key !== 'required')
				}
			}

			return;
		})
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
			checks: filterRequired(field.validation?.checks || [])
			/* checks: (field.validation?.checks || []).map((f: any) => {
				return {
					...f,
					checks: filterRequired(f.checks),
				};
			}), */
		} as Validation,
	};

	// min amount of fields is 1 or more. This doesn't mean that de field is required in a default value context
	// => Remove required props for validation
	if (field.config?.amount?.minValue >= 1) {
		console.log('yes');
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
	console.log({ generateSchemaFieldInput });
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

export const defaultValueCompartmentValidator = (
	field: ContentTypeFieldDetail,
	fieldType?: FieldType
): boolean => {
	const { validationSchema, errorMessages } = getDefaultValueSchemas(field, fieldType);

	const validator = new (formRendererConnector.api as any).CustomValidator(
		validationSchema,
		errorMessages,
		{
			allErrors: true,
			messages: true,
		}
	);

	const validated = validator.validate({ defaultValue: field.defaultValue } || {});

	return isEmpty(validated);
};
