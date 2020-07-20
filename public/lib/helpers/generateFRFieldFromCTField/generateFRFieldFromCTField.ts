import { FieldDataType, FieldSchema } from '@redactie/form-renderer-module';

import { Field } from '../../services/contentTypes';

export const generateFRFieldFromCTField = (field: Field, name?: string): FieldSchema => ({
	name: name ? name : field.name,
	module: field.fieldType?.data?.module,
	label: field.label,
	type: field.fieldType?.data?.componentName,
	config: field.config,
	dataType: field.dataType?.data?.type as FieldDataType,
});
