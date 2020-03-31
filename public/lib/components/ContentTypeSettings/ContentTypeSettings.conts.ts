import { object, string } from 'yup';

export const CT_CC_VALIDATION_SCHEMA = object().shape({
	name: string().required(),
	description: string().required(),
});
