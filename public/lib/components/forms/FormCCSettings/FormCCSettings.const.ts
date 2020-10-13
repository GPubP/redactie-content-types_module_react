import { boolean, number, object, string } from 'yup';

export const FORM_CC_SETTINGS_VALIDATION_SCHEMA = object().shape({
	label: string().required('Label is een verplicht veld'),
	generalConfig: object().shape({
		guideline: string(),
		hidden: boolean(),
		min: number(),
		max: number(),
		placeholder: string(),
	}),
	isMultiple: boolean(),
});

export const IS_MULTIPLE_OPTIONS = [
	{ key: 'single', label: 'Eén item', value: 'false' },
	{ key: 'multiple', label: 'Meerdere items', value: 'true' },
];
