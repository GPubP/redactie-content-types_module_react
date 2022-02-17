import { AlertProps } from '@redactie/utils';

export type AlertMessages = Record<'upsert', { [key in 'success' | 'error']: AlertProps }>;
export const getAlertMessages = (label: string): AlertMessages => ({
	upsert: {
		success: {
			title: 'Bewaard',
			message: `Je hebt het content type ${label} succesvol gewijzigd.`,
		},
		error: {
			title: 'Bewaren mislukt',
			message: `Bewaren van het content type ${label} is mislukt`,
		},
	},
});
