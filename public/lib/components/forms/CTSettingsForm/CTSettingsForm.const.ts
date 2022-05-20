import { object, ObjectSchema, string } from 'yup';

import { ISSUED_PUBLICATION_OPTIONS } from '../../../contentTypes.const';

export const CT_SETTINGS_VALIDATION_SCHEMA = (): ObjectSchema =>
	object().shape({
		meta: object().shape({
			label: string().required('Naam is een verplicht veld'),
			description: string().required('Beschrijving is een verplicht veld'),
		}),
	});

export const ISSUED_PREFILL_OPTIONS = [
	{
		key: 'first-publication',
		label: 'Datum eerste publicatie',
		value: ISSUED_PUBLICATION_OPTIONS.firstPublication,
	},
	{
		key: 'last-publication',
		label: 'Datum laatste publicatie',
		value: ISSUED_PUBLICATION_OPTIONS.lastPublication,
	},
];

export const ISSUED_EDITABLE_OPTIONS = [
	{ key: 'non-editable-prefill', label: 'Niet aanpasbaar', value: false },
	{ key: 'editable-prefill', label: 'Aanpasbaar', value: true },
];
