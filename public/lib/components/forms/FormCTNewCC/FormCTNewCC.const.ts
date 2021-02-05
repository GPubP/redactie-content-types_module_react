import kebabCase from 'lodash.kebabcase';
import { object, string } from 'yup';

import { FieldsByCompartment } from '../../../store/contentTypes';

export const FIELD_TYPES_DEFAULT_OPTION = {
	key: 'default-option',
	label: 'Selecteer een content component',
	value: '',
	disabled: true,
};

export const COMPARTMENT_DEFAULT_OPTION = {
	key: 'default-option',
	label: 'Selecteer een compartiment',
	value: '',
	disabled: true,
};

export const NEW_CC_FORM_VALIDATION_SCHEMA = (fieldsByCompartments: FieldsByCompartment[]): any =>
	object().shape({
		name: string()
			.required('Naam is een verplicht veld')
			.test({
				name: 'noDuplicateLabel',
				message: value => `Naam ${value.originalValue} bestaat reeds`,
				test: label =>
					!fieldsByCompartments.find(compartment =>
						compartment.fields?.find(cc => cc.label === label)
					),
			})
			.test({
				name: 'noDuplicateSystemName',
				message: value => `Systeemnaam ${kebabCase(value.originalValue)} bestaat reeds`,
				test: label =>
					!fieldsByCompartments.find(compartment =>
						compartment.fields?.find(cc => cc.name === kebabCase(label))
					),
			}),
		fieldType: string().required('Gelieve een content component te selecteren'),
	});
