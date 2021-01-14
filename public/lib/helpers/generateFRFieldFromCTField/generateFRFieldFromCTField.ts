import { ContentTypeFieldSchema, FieldSchema } from '@redactie/form-renderer-module';

import formRendererConnector from '../../connectors/formRenderer';
import { Field } from '../../services/contentTypes';

export const generateFRFieldFromCTField = (field: Field, name?: string): FieldSchema => {
	const fields = formRendererConnector.api.parseFields([
		{
			...field,
			name: name ?? field.name,
		} as ContentTypeFieldSchema,
	]);

	return fields[0];
};
