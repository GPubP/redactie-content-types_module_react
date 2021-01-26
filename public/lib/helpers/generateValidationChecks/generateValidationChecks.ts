import { FormValues } from '@redactie/form-renderer-module';
import { pathOr, prop } from 'ramda';

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

function getChecksFromPreset(
	data: Record<string, any>,
	preset: PresetDetailModel
): ValicationCheckWithFields[] {
	return [
		{
			type: 'object',
			fields: preset?.data?.fields?.reduce((fields, field) => {
				const fieldValidationData = prop(field.field?.name, data);

				console.log(field);

				const fieldType = {
					...field.field?.fieldType?.data,
					validators: field.validators,
				};

				// eslint-disable-next-line @typescript-eslint/no-use-before-define
				const response = generateValidationChecks(
					fieldValidationData,
					fieldType,
					field.field.preset as PresetDetailModel | undefined
				);

				fields.push({
					type: field.field?.dataType?.data?.type,
					name: field.field?.name,
					checks: [
						...(field.field?.validation?.checks || []),
						...response.checks,
					] as ValidationCheck[],
				});

				return fields;
			}, [] as ValidationCheckField[]),
		},
	];
}

export function generateValidationChecks(
	data: FormValues,
	fieldTypeData: FieldTypeData,
	preset?: PresetDetailModel
): Validation {
	const allChecksReverseOrder: ValidationCheck[] = [
		...getChecksFromData(data, preset?.data?.validators || fieldTypeData.validators),
		...(getChecksFromDefaultValidatorValues(
			fieldTypeData.defaultValidatorValues
		) as ValidationCheck[]),
		...getChecksFromDefaultValue(preset?.data?.validators || fieldTypeData.validators),
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

	return preset
		? {
				type: 'object',
				checks: [...checks, ...getChecksFromPreset(data, preset)],
		  }
		: {
				type: fieldTypeData?.dataType?.data?.type,
				checks,
		  };
}
