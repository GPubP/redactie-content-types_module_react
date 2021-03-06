import { I18NextTranslations } from '@redactie/translations-module';

import { translationsAPI } from '../connectors/translations';
import { CtTypes } from '../contentTypes.types';

const tKey = translationsAPI.core.tKey;

const MODULE_TRANSLATIONS = Object.freeze<{
	main: I18NextTranslations;
	[CtTypes.contentTypes]: I18NextTranslations;
	[CtTypes.contentBlocks]: I18NextTranslations;
}>({
	main: Object.freeze({}),
	[CtTypes.contentTypes]: Object.freeze<I18NextTranslations>({
		OVERVIEW_TITLE: tKey('CT_OVERVIEW_TITLE', 'Content types'),
		OVERVIEW_LOADING: tKey('CT_OVERVIEW_LOADING', 'Content types ophalen'),
		BADGE_TYPE: tKey('CT_BADGE_TYPE', 'Content type'),
		ALERT_TITLE: tKey('CT_ALERT_TITLE', 'Content type'),
		ALERT_MESSAGE: tKey('CT_ALERT_MESSAGE', 'content type'),
		SETTINGS_NAME_GUIDELINE: tKey(
			'CT_SETTINGS_NAME_GUIDELINE',
			'Geef het content type een korte en duidelijke naam.'
		),
		SETTINGS_DESCRIPTION_GUIDELINE: tKey(
			'CT_SETTINGS_DESCRIPTION_GUIDELINE',
			'Geef het content type een duidelijke beschrijving. Deze wordt gebruikt in het overzicht.'
		),
		SETTINGS_ISSUED_ON_PREFILL: tKey(
			'CT_SETTINGS_ISSUED_ON_PREFILL',
			'Bepaal met welke publicatiedatum de uitgiftedatum vooraf ingevuld zal worden'
		),
		SETTINGS_ISSUED_ON_EDITABLE: tKey(
			'CT_SETTINGS_ISSUED_ON_EDITABLE',
			'Bepaal of de redacteur de uitgiftedatum mag aanpassen'
		),
		SITES_INTRO: tKey(
			'CT_SITES_INTRO',
			'Bepaal op welke sites dit content type geactiveerd mag worden. Opgelet: je kan het content type enkel deactiveren wanneer er géén content items van dit type meer bestaan binnen de desbetreffende site.'
		),
	}),
	[CtTypes.contentBlocks]: Object.freeze<I18NextTranslations>({
		OVERVIEW_TITLE: tKey('CB_OVERVIEW_TITLE', 'Content blokken'),
		OVERVIEW_LOADING: tKey('CB_OVERVIEW_LOADING', 'Content blokken ophalen'),
		BADGE_TYPE: tKey('CB_BADGE_TYPE', 'Content blok'),
		ALERT_TITLE: tKey('CB_ALERT_TITLE', 'Content blok'),
		ALERT_MESSAGE: tKey('CB_ALERT_MESSAGE', 'content blok'),
		SETTINGS_NAME_GUIDELINE: tKey(
			'CB_SETTINGS_NAME_GUIDELINE',
			'Geef het content blok een korte en duidelijke naam.'
		),
		SETTINGS_DESCRIPTION_GUIDELINE: tKey(
			'CB_SETTINGS_DESCRIPTION_GUIDELINE',
			'Geef het content blok een duidelijke beschrijving. Deze wordt gebruikt in het overzicht'
		),
		SETTINGS_ISSUED_ON_PREFILL: tKey(
			'CB_SETTINGS_ISSUED_ON_PREFILL',
			'Bepaal met welke publicatiedatum de uitgiftedatum vooraf ingevuld zal worden'
		),
		SETTINGS_ISSUED_ON_EDITABLE: tKey(
			'CB_SETTINGS_ISSUED_ON_EDITABLE',
			'Bepaal of de redacteur de uitgiftedatum mag aanpassen'
		),
		SITES_INTRO: tKey(
			'CB_SITES_INTRO',
			'Bepaal op welke sites dit content blok geactiveerd mag worden. Opgelet: je kan het content blok enkel deactiveren wanneer er géén content items van dit type meer bestaan binnen de desbetreffende site.'
		),
	}),
});

export { MODULE_TRANSLATIONS };
