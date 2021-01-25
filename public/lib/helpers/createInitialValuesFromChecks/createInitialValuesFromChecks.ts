import {
	FormValues,
	ValicationCheckWithAllowedFields,
	ValicationCheckWithFields,
	ValidationCheck,
} from '@redactie/form-renderer-module';

import { ValidationCheckField } from '../../api/api.types';

export function createInitialValuesFromFields(fields: ValidationCheckField[]): FormValues {
	return fields.reduce((value, field) => {
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		value[field.name] = createInitialValuesFromChecks(field.checks);
		return value;
	}, {} as FormValues);
}

export function createInitialValuesFromChecks(
	checks: (ValidationCheck | ValicationCheckWithFields | ValicationCheckWithAllowedFields)[] = []
): FormValues {
	// NOTE!: We need to set the checks to any because typescript can not reduce over a tuple type
	return (checks as any).reduce((value: FormValues, check: any) => {
		if (check.fields) {
			return {
				...value,
				...createInitialValuesFromFields(check.fields),
			};
		}
		value[check.key] = check.val;
		return value;
	}, {} as FormValues);
}
