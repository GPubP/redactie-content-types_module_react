import { object, string } from 'yup';

export const CONTENT_TYPES_SETTINGS_VALIDATION_SCHEMA = object().shape({
	name: string().required(),
	description: string().required(),
});
