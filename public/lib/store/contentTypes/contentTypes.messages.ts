import { AlertProps } from '@redactie/utils';

import { ContentTypeDetailResponse } from '../../services/contentTypes';

export type AlertMessages = Record<
	'create' | 'update',
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
});
