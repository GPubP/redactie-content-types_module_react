import kebabCase from 'lodash.kebabcase';
import { object, string } from 'yup';

import { DEFAULTCOMPARTMENTS } from '../../../contentTypes.const';
import { FormCTNewCompartmentState } from './FormCTNewCompartment.types';

export const createDefaultState = (): FormCTNewCompartmentState => ({
	name: '',
});

export const NEW_COMPARTMENT_FORM_VALIDATION_SCHEMA = object().shape({
	name: string()
		.required('Naam is een verplicht veld')
		.test({
			name: 'noDuplicateName',
			message: value => `Naam ${value.originalValue} bestaat reeds`,
			test: label =>
				!DEFAULTCOMPARTMENTS.find(compartment => compartment === kebabCase(label)),
		}),
});
