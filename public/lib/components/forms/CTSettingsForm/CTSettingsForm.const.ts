import { object, string } from 'yup';

import { FieldsByCompartment } from '../../../store/contentTypes';

export const CT_SETTINGS_VALIDATION_SCHEMA = object().shape({
	meta: object().shape({
		label: string().required('Naam is een verplicht veld'),
		description: string().required('Beschrijving is een verplicht veld'),
	}),
});

export const CT_SETTINGS_VALIDATION_SCHEMA_DUPLICATE = (
	fieldsByCompartments: FieldsByCompartment[]
): any =>
	object().shape({
		name: string()
			.required('Naam is een verplicht veld')
			.test({
				name: 'No duplicate',
				message: value => `Naam ${value.originalValue} bestaat reeds`,
				test: name =>
					!fieldsByCompartments.find(compartment =>
						compartment.fields?.find(cc => cc.label === name)
					),
			}),
	});
