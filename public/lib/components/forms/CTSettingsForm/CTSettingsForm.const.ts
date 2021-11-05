import { object, string } from 'yup';

export const CT_SETTINGS_VALIDATION_SCHEMA = object().shape({
	meta: object().shape({
		label: string().required('Naam is een verplicht veld'),
		description: string().required('Beschrijving is een verplicht veld'),
		urlPath: object().shape({
			pattern: string().matches(
				/^((\/\[([a-zA-Z0-9])+:([a-zA-Z0-9])+\])|(\/([a-zA-Z0-9-])+))+$/,
				'Het URL patroon is niet correct. Dit moet een geldig pad zijn dat begint met een "/" en mag enkel pad segmenten en placeholders bevatten'
			),
		}),
	}),
});
