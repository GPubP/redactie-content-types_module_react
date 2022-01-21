import { AlertProps } from '@redactie/utils';
import { moduleTranslate } from '../../connectors/translations';
import { CtTypes } from '../../contentTypes.types';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { ContentTypeDetailResponse } from '../../services/contentTypes';

export type AlertMessages = Record<
	'create' | 'update' | 'updateWorkflow' | 'remove',
	{ [key in 'success' | 'error']: AlertProps }
>;
export const getAlertMessages = (
	data: ContentTypeDetailResponse,
	ctType: CtTypes
): AlertMessages => ({
	create: {
		success: {
			title: 'Aangemaakt',
			message: `Je hebt een nieuw ${moduleTranslate(
				MODULE_TRANSLATIONS[ctType].ALERT_MESSAGE
			)} ${data.meta.label} aangemaakt.`,
		},
		error: {
			title: 'Aanmaken mislukt',
			message: `Aanmaken van het ${moduleTranslate(
				MODULE_TRANSLATIONS[ctType].ALERT_MESSAGE
			)} ${data.meta.label} is mislukt.`,
		},
	},
	update: {
		success: {
			title: 'Bewaard',
			message: `Je hebt het ${moduleTranslate(MODULE_TRANSLATIONS[ctType].ALERT_MESSAGE)} ${
				data.meta.label
			} succesvol gewijzigd.`,
		},
		error: {
			title: 'Bewaren mislukt',
			message: `Bewaren van het content type ${data.meta.label} is mislukt`,
		},
	},
	remove: {
		success: {
			title: `${moduleTranslate(MODULE_TRANSLATIONS[ctType].ALERT_TITLE)} verwijderd`,
			message: `Je hebt het ${moduleTranslate(MODULE_TRANSLATIONS[ctType].ALERT_MESSAGE)} ${
				data.meta.label
			} succesvol verwijderd.`,
		},
		error: {
			title: `${moduleTranslate(
				MODULE_TRANSLATIONS[ctType].ALERT_TITLE
			)} verwijderen mislukt`,
			message: `Het verwijderen van het ${moduleTranslate(
				MODULE_TRANSLATIONS[ctType].ALERT_MESSAGE
			)} ${data.meta.label} is mislukt..`,
		},
	},
	updateWorkflow: {
		success: {
			title: 'Workflow bewaard',
			message: `De nieuwe statussen voor dit ${moduleTranslate(
				MODULE_TRANSLATIONS[ctType].ALERT_MESSAGE
			)} werden bepaald.`,
		},
		error: {
			title: 'Bewaren mislukt',
			message: `Bewaren van een nieuwe workflow voor dit ${moduleTranslate(
				MODULE_TRANSLATIONS[ctType].ALERT_TITLE
			)} is mislukt.`,
		},
	},
});
