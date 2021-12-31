import kebabCase from 'lodash.kebabcase';
import { object, string } from 'yup';

import { DEFAULTCOMPARTMENTS } from '../../../contentTypes.const';

export const EDIT_COMPARTMENT_FORM_VALIDATION_SCHEMA = object().shape({
	name: string()
		.required('Naam is een verplicht veld')
		.test({
			name: 'noDuplicateName',
			message: value => `Naam ${value.originalValue} bestaat reeds`,
			test: label =>
				!DEFAULTCOMPARTMENTS.find(compartment => compartment === kebabCase(label)),
		}),
});
