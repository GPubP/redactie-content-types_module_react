import { FieldSchema, FormSchema } from '@redactie/form-renderer-module';

import { PresetDetailModel } from '../../store/presets';
import { generateFRFieldFromCTField } from '../generateFRFieldFromCTField';

export const generateFormSchemaFromPreset = (preset: PresetDetailModel): FormSchema => {
	const baseFSchema = preset?.data?.validators.reduce((fSchema, validator) => {
		validator.data?.formSchema?.fields.forEach(validatorField =>
			fSchema.push(generateFRFieldFromCTField(validatorField, validatorField.name))
		);
		return fSchema;
	}, [] as FieldSchema[]);

	return {
		fields: preset?.data?.fields?.reduce((fSchema, field) => {
			if (field.validators?.length <= 0) {
				return fSchema;
			}

			field.validators.forEach(validator =>
				validator.data?.formSchema?.fields.forEach(validatorField =>
					fSchema.push(
						generateFRFieldFromCTField(
							validatorField,
							`${field.field.name}.${validatorField.name}`
						)
					)
				)
			);

			return fSchema;
		}, baseFSchema),
	};
};
