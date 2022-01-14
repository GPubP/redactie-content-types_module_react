import { FormSchema } from '@redactie/form-renderer-module';
import { FormikValues } from 'formik';

import { ContentTypeFieldDetail } from '../../services/contentTypes';
import { PresetDetailModel } from '../../store/presets';

import { parseRequiredToBool } from './parseRequiredToBool';

export const generateConfigFromValidationData = (
	data: FormikValues,
	preset?: PresetDetailModel,
	fieldConfig?: ContentTypeFieldDetail['config'],
	schema?: FormSchema
): Record<string, any> => {

	const adjustedFieldConfig = schema?.fields.reduce(
		(acc, field) => {
			if (field?.config?.mapToConfig) {
				return {
					...acc,
					[field.name]: data[field.name],
				};
			}

			return acc;
		},
		{ ...fieldConfig }
	);

	return preset
		? Object.keys(data).reduce(
				(acc: any, fieldName: string) => {
					const required = parseRequiredToBool(data[fieldName]?.required);

					return {
						...acc,
						fields: acc.field?.map((subField: any) => {
							if (subField.name !== fieldName || required === null) {
								return subField;
							}

							return {
								...subField,
								config: generateConfigFromValidationData(
									data[fieldName] || {},
									subField.preset as PresetDetailModel | undefined,
									subField.config
								),
								generalConfig: {
									...subField.generalConfig,
									required,
								},
							};
						}),
					};
				},
				{
					...(adjustedFieldConfig || {}),
				}
		  )
		: adjustedFieldConfig || {};
};
