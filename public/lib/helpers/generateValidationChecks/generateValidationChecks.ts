import { FormValues } from '@redactie/form-renderer-module';
import { pathOr } from 'ramda';

import { DEFAULT_VALIDATOR_ERROR_MESSAGES } from '../../contentTypes.const';
import {
	ValicationCheckWithAllowedFields,
	ValicationCheckWithFields,
	Validation,
	ValidationCheck,
	ValidationCheckField,
} from '../../services/contentTypes';
import { FieldTypeData } from '../../services/fieldTypes';
import { Validator } from '../../services/presets';
import { PresetDetailModel } from '../../store/presets';

const createCheck = (key: string, val: unknown, validator?: Validator): ValidationCheck => ({
	key,
	val,
	err: pathOr(
		DEFAULT_VALIDATOR_ERROR_MESSAGES[key],
		['data', 'defaultValue', key, 'err'],
		validator || {}
	),
});

const getChecksFromDefaultValue = (validators: Validator[] = []): ValidationCheck[] => {
	return validators.reduce((checks, validator) => {
		if (validator.data.defaultValue) {
			return [
				...checks,
				...Object.keys(validator.data.defaultValue).map(key => {
					const val = validator.data.defaultValue[key].val;
					return createCheck(key, val, validator);
				}),
			];
		}
		return checks;
	}, [] as ValidationCheck[]);
};

const getChecksFromDefaultValidatorValues = (
	defaultValidatorValues: Validation
): (ValidationCheck | ValicationCheckWithFields | ValicationCheckWithAllowedFields)[] => {
	return defaultValidatorValues?.checks?.length > 0 ? defaultValidatorValues.checks : [];
};

const getChecksFromData = (
	data: Record<string, any> = {},
	validators: Validator[] = []
): ValidationCheck[] => {
	return Object.keys(data).reduce((acc, key) => {
		const validator = validators.find(validator => {
			return !!(validator.data?.formSchema?.fields || []).find(field => field.name === key);
		});

		if (!validator) {
			return acc;
		}

		const val = data[key];

		return acc.concat([createCheck(key, val, validator)]);
	}, [] as ValidationCheck[]);
};

const getChecksFromPreset = (
	data: Record<string, any>,
	preset: PresetDetailModel,
	create = false
): ValicationCheckWithFields[] => {
	return [
		{
			type: 'object',
			fields: preset?.data?.fields?.reduce((fields, field) => {
				const check = {
					type: field.field?.dataType?.data?.type,
					name: field.field?.name,
					checks: [],
				};
				const fieldValidationData = data[field.field?.name];

				if (create) {
					fields.push({
						...check,
						checks: getChecksFromDefaultValue(field.validators),
					});

					return fields;
				}

				if (fieldValidationData) {
					fields.push({
						...check,
						checks: [...getChecksFromData(fieldValidationData, field.validators)],
					});

					return fields;
				}

				fields.push(check);

				return fields;
			}, [] as ValidationCheckField[]),
		},
	];
};

export const generateValidationChecks = (
	data: FormValues,
	fieldTypeData: FieldTypeData,
	preset?: PresetDetailModel,
	create = false
): Validation => {
	if (preset) {
		return {
			type: 'object',
			checks: getChecksFromPreset(data, preset, create),
		};
	}

	const allChecksReverseOrder: ValidationCheck[] = [
		...getChecksFromData(data, fieldTypeData.validators),
		...(getChecksFromDefaultValidatorValues(
			fieldTypeData.defaultValidatorValues
		) as ValidationCheck[]),
		...getChecksFromDefaultValue(fieldTypeData.validators),
	];
	const { checks } = allChecksReverseOrder.reduce(
		(acc, check) => {
			if (!check.key || acc.keys.includes(check.key)) {
				return acc;
			}

			return {
				keys: [...acc.keys, check.key],
				checks: [...acc.checks, check],
			};
		},
		{
			keys: [] as string[],
			checks: [] as ValidationCheck[],
		}
	);

	return {
		type: fieldTypeData?.dataType?.data?.type,
		checks,
	};
};
