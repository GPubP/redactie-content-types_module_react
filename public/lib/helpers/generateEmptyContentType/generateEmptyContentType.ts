import { CONTENT_COMPARTMENT_UUID } from '../../contentTypes.const';
import { ContentTypeCreateRequest } from '../../services/contentTypes';

export const generateEmptyContentType = (): ContentTypeCreateRequest => ({
	compartments: [
		{
			uuid: CONTENT_COMPARTMENT_UUID,
			label: 'Inhoud',
			removable: false,
		},
	],
	fields: [],
	modulesConfig: [],
	meta: {
		canBeFiltered: false,
		label: '',
		safeLabel: '',
		description: '',
		deleted: false,
	},
});
