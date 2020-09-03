import { FormValues } from '@redactie/form-renderer-module';
import { path, pathOr } from 'ramda';

import { DEFAULT_VALIDATOR_ERROR_MESSAGES } from '../../contentTypes.const';
import {
	ValicationCheckWithFields,
	Validation,
	ValidationCheck,
	ValidationCheckField,
} from '../../services/contentTypes';
import { FieldTypeData } from '../../services/fieldTypes';
import { PresetDetail, Validator } from '../../services/presets';

const createCheck = (key: string, val: unknown, validator?: Validator): ValidationCheck => ({
	key,
	// TODO: Acpaas ui component Radio Field can not handle boolean values as options
	// Remove this functionality when the issue is fixed
	val: val === 'true' ? true : val === 'false' ? false : val,
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
): ValidationCheck[] | ValicationCheckWithFields[] => {
	return defaultValidatorValues.checks?.length > 0 ? defaultValidatorValues.checks : [];
};

const getChecksFromData = (
	data: Record<string, any> = {},
	validators: Validator[] = []
): ValidationCheck[] => {
	return Object.keys(data).map(Key => {
		const validator = validators.find(
			validator => !!path(['data', 'defaultValue', Key], validator)
		);
		const val = data[Key];

		return createCheck(Key, val, validator);
	});
};

const getChecksFromPreset = (
	data: Record<string, any>,
	preset: PresetDetail,
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
						checks: getChecksFromData(fieldValidationData, field.validators),
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
	preset?: PresetDetail,
	create = false
): Validation => {
	return preset
		? {
				type: 'object',
				checks: getChecksFromPreset(data, preset, create),
		  }
		: {
				type: fieldTypeData?.dataType?.data?.type,
				checks: [
					...getChecksFromDefaultValue(fieldTypeData.validators),
					...(getChecksFromDefaultValidatorValues(
						fieldTypeData.defaultValidatorValues
					) as ValidationCheck[]),
					...getChecksFromData(data, fieldTypeData.validators),
				],
		  };
};
