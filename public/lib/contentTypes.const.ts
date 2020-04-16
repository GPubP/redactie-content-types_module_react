import { Tab } from './types';

export const BREADCRUMB_OPTIONS = {
	excludePaths: ['/', '/:tenantId'],
};

export const CONTENT_TYPE_DETAIL_TAB_MAP: {
	[key in 'settings' | 'contentComponents' | 'sites']: Tab;
} = {
	settings: {
		name: 'Instellingen',
		target: 'instellingen',
		active: true,
	},
	contentComponents: {
		name: 'Content Componenten',
		target: 'content-componenten',
		active: false,
	},
	sites: {
		name: 'Sites',
		target: 'sites',
		active: false,
	},
};

export const CONTENT_DETAIL_TABS: Tab[] = [
	CONTENT_TYPE_DETAIL_TAB_MAP.settings,
	CONTENT_TYPE_DETAIL_TAB_MAP.contentComponents,
	CONTENT_TYPE_DETAIL_TAB_MAP.sites,
];

const CC_EDIT_PATH = '/content-types/:contentTypeUuid/content-componenten/bewerken';
const CC_NEW_PATH = '/content-types/:contentTypeUuid/content-componenten/nieuw';

export const MODULE_PATHS = {
	root: '/content-types',
	admin: '/content-types/beheer',
	create: '/content-types/aanmaken',
	createSettings: '/content-types/aanmaken/instellingen',
	detail: '/content-types/:contentTypeUuid',
	detailSettings: '/content-types/:contentTypeUuid/instellingen',
	detailCC: '/content-types/:contentTypeUuid/content-componenten',
	detailSites: '/content-types/:contentTypeUuid/sites',
	editCC: '/content-types/:contentTypeUuid/bewerken',
	detailCCNew: CC_NEW_PATH,
	detailCCNewSettings: `${CC_NEW_PATH}/instellingen`,
	detailCCNewConfig: `${CC_NEW_PATH}/configuratie`,
	detailCCNewValidation: `${CC_NEW_PATH}/validatie`,
	detailCCNewDefaults: `${CC_NEW_PATH}/standaard-waarde`,
	detailCCEdit: CC_EDIT_PATH,
	detailCCEditSettings: `${CC_EDIT_PATH}/instellingen`,
	detailCCEditConfig: `${CC_EDIT_PATH}/configuratie`,
	detailCCEditValidation: `${CC_EDIT_PATH}/validatie`,
	detailCCEditDefaults: `${CC_EDIT_PATH}/standaard-waarde`,
};
