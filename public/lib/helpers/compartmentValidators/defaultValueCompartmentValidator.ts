import { Field, generateErrorMessages, generateSchema } from '@wcm/jsonschema-generator';
import { isEmpty } from 'ramda';

import formRendererConnector from '../../connectors/formRenderer';
import { ContentTypeFieldDetail, Validation, ValidationCheck } from '../../services/contentTypes';
import { FieldType } from '../../services/fieldTypes/fieldTypes.service.types';

const getDefaultValueField = (field: ContentTypeFieldDetail): ContentTypeFieldDetail => {
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
	return {
		...field,
		name: 'defaultValue',
		generalConfig: {
			...field.generalConfig,
			required: false,
		},
		validation: {
			...field.validation,
			checks: (field.validation?.checks || []).filter(
				check => (check as ValidationCheck).key !== 'required'
			),
		} as Validation,
	};
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
