import { object, string } from 'yup';

export const EDIT_COMPARTMENT_FORM_VALIDATION_SCHEMA = object().shape({
	name: string().required('Naam is een verplicht veld'),
});
