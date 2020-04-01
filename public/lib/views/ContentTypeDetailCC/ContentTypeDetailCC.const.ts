import { array, object, string } from 'yup';

export const CT_CC_VALIDATION_SCHEMA = object().shape({
	fields: array(
		object().shape({
			uuid: string(),
			label: string().required(),
			name: string().required(),
			module: string()
				.required()
				.default('default'),
			dataType: string().required(),
			fieldType: string().required(),
			config: object().default({}),
			validators: array(string()),
		})
	),
});
