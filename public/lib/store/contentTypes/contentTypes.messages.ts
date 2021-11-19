import { AlertProps } from '@redactie/utils';

import { ContentTypeDetailResponse } from '../../services/contentTypes';

export type AlertMessages = Record<
	'create' | 'update' | 'updateWorkflow' | 'remove',
	{ [key in 'success' | 'error']: AlertProps }
>;

export const getAlertMessages = (data: ContentTypeDetailResponse): AlertMessages => ({
	create: {
		success: {
			title: 'Aangemaakt',
			message: `U hebt een nieuw content type ${data.meta.label} aangemaakt`,
		},
		error: {
			title: 'Aanmaken mislukt',
			message: `Aanmaken van het content type ${data.meta.label} is mislukt`,
		},
	},
	update: {
		success: {
			title: 'Bewaard',
			message: `U hebt het content type ${data.meta.label} succesvol gewijzigd`,
		},
		error: {
			title: 'Bewaren mislukt',
			message: `Bewaren van het content type ${data.meta.label} is mislukt`,
		},
	},
	remove: {
		success: {
			title: 'Content type verwijderd',
			message: `U hebt het content-type ${data.meta.label} succesvol verwijderd`,
		},
		error: {
			title: 'Content type verwijderen mislukt',
			message: `Het verwijderen van het content type ${data.meta.label} is mislukt`,
		},
	},
	updateWorkflow: {
		success: {
			title: 'Workflow bewaard',
			message: `De nieuwe statussen voor dit content type werden bepaald`,
		},
		error: {
			title: 'Bewaren mislukt',
			message: `Bewaren van een nieuwe workflow voor dit content type is mislukt`,
		},
	},
});
