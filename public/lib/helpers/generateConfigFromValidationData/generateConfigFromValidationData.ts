import { FormikValues } from 'formik';

import { ContentTypeFieldDetail } from '../../services/contentTypes';
import { PresetDetailModel } from '../../store/presets';

import { parseRequiredToBool } from './parseRequiredToBool';

export const generateConfigFromValidationData = (
	data: FormikValues,
	preset?: PresetDetailModel,
	fieldConfig?: ContentTypeFieldDetail['config']
): Record<string, any> => {
	return preset
		? Object.keys(data).reduce(
				(acc, fieldName) => {
					const required = parseRequiredToBool(data[fieldName]?.required);

					return {
						...acc,
						fields: acc.fields?.map(subField => {
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
					...(fieldConfig || {}),
				}
		  )
		: fieldConfig || {};
};
