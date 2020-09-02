import { FieldDataType, FieldSchema, Preset } from '@redactie/form-renderer-module';

import { Field } from '../../services/contentTypes';

export const generateFRFieldFromCTField = (
	field: Field,
	name?: string
): FieldSchema & { defaultValue?: any } => ({
	name: name ? name : field.name,
	module: field.fieldType?.data?.module,
	label: field.label,
	type: field.fieldType?.data?.componentName,
	config: {
		...field.config,
		...field.generalConfig,
		description: field.generalConfig.guideline,
		preset: (field.preset as unknown) as Preset,
	},
	...(field.preset && Array.isArray(field.config?.fields)
		? { fields: field.config.fields.map(field => generateFRFieldFromCTField(field)) }
		: {}),
	dataType: field.dataType?.data?.type as FieldDataType,
	defaultValue: field.defaultValue,
});
