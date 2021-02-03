import { object, string } from 'yup';

import { FormCTNewCompartmentState } from './FormCTNewCompartment.types';

export const createDefaultState = (): FormCTNewCompartmentState => ({
	name: '',
});

export const NEW_COMPARTMENT_FORM_VALIDATION_SCHEMA = object().shape({
	name: string().required('Naam is een verplicht veld'),
});
