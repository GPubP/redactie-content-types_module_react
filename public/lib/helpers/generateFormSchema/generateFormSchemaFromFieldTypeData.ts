import { FormSchema } from '@redactie/form-renderer-module';

import { Field } from '../../api/api.types';
import { FieldTypeData } from '../../services/fieldTypes/fieldTypes.service.types';
import { generateFRFieldFromCTField } from '../generateFRFieldFromCTField';

export const generateFormSchemaFromFieldTypeData = (fieldTypeData: FieldTypeData): FormSchema => ({
	fields: Array.isArray(fieldTypeData?.validators)
		? fieldTypeData.validators.reduce((acc, validator) => {
				return [
					...acc,
					...validator.data?.formSchema?.fields?.map((validatorField: Field) =>
						generateFRFieldFromCTField(validatorField)
					),
				];
		  }, [])
		: [],
});
