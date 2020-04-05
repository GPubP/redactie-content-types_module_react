import { Tab } from './types';

export const BREADCRUMB_OPTIONS = {
	excludePaths: ['/', '/:tenantId'],
};

export const CONTENT_DETAIL_TABS: Tab[] = [
	{
		name: 'Instellingen',
		target: 'instellingen',
		active: true,
	},
	{
		name: 'Content Componenten',
		target: 'content-componenten',
		active: false,
	},
	{
		name: 'Sites',
		target: 'sites',
		active: false,
	},
];

const CC_EDIT_PATH = '/content-types/:contentTypeUuid/content-componenten/bewerken';
const CC_NEW_PATH = '/content-types/aanmaken/content-componenten/nieuw';

export const MODULE_PATHS = {
	root: '/content-types',
	admin: '/content-types/beheer',
	create: '/content-types/aanmaken',
	createSettings: '/content-types/aanmaken/instellingen',
	createCC: '/content-types/aanmaken/content-componenten',
	createCCNew: CC_NEW_PATH,
	createCCNewSettings: `${CC_NEW_PATH}/instellingen`,
	createCCNewConfig: `${CC_NEW_PATH}/configuratie`,
	createCCNewValidation: `${CC_NEW_PATH}/validatie`,
	createCCNewDefaults: `${CC_NEW_PATH}/standaard-waarden`,
	createSites: '/content-types/aanmaken/sites',
	detail: '/content-types/:contentTypeUuid',
	edit: '/content-types/:contentTypeUuid/bewerken',
	detailSettings: '/content-types/:contentTypeUuid/instellingen',
	detailCC: '/content-types/:contentTypeUuid/content-componenten',
	detailSites: '/content-types/:contentTypeUuid/sites',
	editCC: '/content-types/:contentTypeUuid/bewerken',
	detailCCEdit: CC_EDIT_PATH,
	detailCCEditSettings: `${CC_EDIT_PATH}/instellingen`,
	detailCCEditConfig: `${CC_EDIT_PATH}/configuratie`,
	detailCCEditValidation: `${CC_EDIT_PATH}/validatie`,
	detailCCEditDefaults: `${CC_EDIT_PATH}/standaard-waarden`,
};
