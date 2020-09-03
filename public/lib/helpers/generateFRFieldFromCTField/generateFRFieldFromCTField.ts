import { FieldSchema } from '@redactie/form-renderer-module';

import { Field } from '../../services/contentTypes';
import { parseFields } from '../parseFields';

export const generateFRFieldFromCTField = (field: Field, name?: string): FieldSchema => {
	const fields = parseFields([
		{
			...field,
			name: name ?? field.name,
		},
	]);

	return fields[0];
};
