import { FormValues } from '@redactie/form-renderer-module';

import { Validation, ValidationCheckField } from '../../services/contentTypes';
import { FieldTypeData } from '../../services/fieldTypes';
import { PresetDetail } from '../../services/presets';

export const generateValidationChecks = (
	data: FormValues,
	fieldTypeData: FieldTypeData,
	preset?: PresetDetail
): Validation => {
	if (preset) {
		return {
			type: 'object',
			checks: [
				{
					type: 'object',
					fields: preset?.data?.fields?.reduce((fields, field) => {
						const validators = data[field.field?.name];
						const check = {
							type: field.field?.dataType?.data?.type,
							name: field.field?.name,
							checks: [],
						};
						if (validators) {
							fields.push({
								...check,
								checks: Object.keys(validators).map(key => {
									const val = validators[key];
									return {
										key,
										val: val === 'true' ? true : val === 'false' ? false : val,
										// TODO: Replace this with the default value
										err: 'Gelieve een geldige url in te vullen',
									};
								}),
							});

							return fields;
						}
						fields.push(check);
						return fields;
					}, [] as ValidationCheckField[]),
				},
			],
		};
	}

	return {
		type: fieldTypeData?.dataType?.data?.type,
		checks: Object.keys(data).map(validatorKey => ({
			key: validatorKey,
			val: data[validatorKey],
			// TODO: Replace this with the default value
			err: 'something went wrong',
		})),
	};
};
