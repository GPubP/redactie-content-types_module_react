import { FormValues } from '@redactie/form-renderer-module';
import { path, pathOr } from 'ramda';

import { DEFAULT_VALIDATOR_ERROR_MESSAGES } from '../../contentTypes.const';
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
								checks: Object.keys(validators).map((key: string) => {
									const val = validators[key];
									const validator = field.validators.find(
										validator =>
											!!path(['data', 'defaultValue', key], validator)
									);

									return {
										key,
										val: val === 'true' ? true : val === 'false' ? false : val,
										err: pathOr(
											DEFAULT_VALIDATOR_ERROR_MESSAGES[key],
											['data', 'defaultValue', key, 'err'],
											validator
										),
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
		checks: Object.keys(data).map(validatorKey => {
			const validator = fieldTypeData.validators.find(
				validator => !!path(['data', 'defaultValue', validatorKey], validator)
			);

			return {
				key: validatorKey,
				val: data[validatorKey],
				err: pathOr(
					DEFAULT_VALIDATOR_ERROR_MESSAGES[validatorKey],
					['data', 'defaultValue', validatorKey, 'err'],
					validator
				),
			};
		}),
	};
};
