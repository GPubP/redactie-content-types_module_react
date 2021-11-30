import { object, ObjectSchema, string } from 'yup';

import { CtTypes } from '../../../contentTypes.types';

export const CT_SETTINGS_VALIDATION_SCHEMA = (ctType: CtTypes): ObjectSchema =>
	object().shape({
		meta: object().shape({
			label: string().required('Naam is een verplicht veld'),
			description: string().required('Beschrijving is een verplicht veld'),
			...(ctType === CtTypes.contentTypes && {
				urlPath: object().shape({
					pattern: string()
						.matches(
							/^((\/\[([a-zA-Z0-9])+:([a-zA-Z0-9])+\])|(\/([a-zA-Z0-9-])+))+$/,
							'Het URL patroon is niet correct. Dit moet een geldig pad zijn dat begint met een "/" en mag enkel pad segmenten en placeholders bevatten'
						)
						.required('URL patroon is een verplicht veld'),
				}),
			}),
		}),
	});
