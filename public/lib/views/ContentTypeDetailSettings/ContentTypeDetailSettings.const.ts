import { object, string } from 'yup';

export const CT_SETTINGS_VALIDATION_SCHEMA = object().shape({
	meta: object().shape({
		label: string().required(),
		description: string().required(),
	}),
});
