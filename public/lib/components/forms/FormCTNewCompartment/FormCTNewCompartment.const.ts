import kebabCase from 'lodash.kebabcase';
import { object, ObjectSchema, string } from 'yup';

import { DEFAULT_COMPARTMENTS } from '../../../contentTypes.const';
import { Compartment } from '../../../services/contentTypes';
import { FormCTNewCompartmentState } from './FormCTNewCompartment.types';

export const createDefaultState = (): FormCTNewCompartmentState => ({
	name: '',
});

export const NEW_COMPARTMENT_FORM_VALIDATION_SCHEMA = (
	compartments: Compartment[]
): ObjectSchema<FormCTNewCompartmentState> =>
	object().shape({
		name: string()
			.required('Naam is een verplicht veld')
			.test({
				name: 'noDuplicateName',
				message: value => `Naam ${value.originalValue} bestaat reeds`,
				test: label =>
					!DEFAULT_COMPARTMENTS.find(compartment => compartment === kebabCase(label)) &&
					!compartments.find(compartment => {
						return compartment.label === label;
					}),
			}),
	});
