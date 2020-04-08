import { Tab } from './types';

export const BREADCRUMB_OPTIONS = {
	excludePaths: ['/', '/:tenantId'],
};

export const CONTENT_TYPE_DETAIL_TAB_MAP: { [key: string]: Tab } = {
	settings: {
		name: 'Instellingen',
		target: 'instellingen',
		active: true,
	},
	contentComponenten: {
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
	CONTENT_TYPE_DETAIL_TAB_MAP.contentComponenten,
	CONTENT_TYPE_DETAIL_TAB_MAP.sites,
];

export const MODULE_PATHS = {
	root: '/content-types',
	admin: '/content-types/beheer',
	create: '/content-types/aanmaken',
	createSettings: '/content-types/aanmaken/instellingen',
	createCC: '/content-types/aanmaken/content-componenten',
	createCCnew: '/content-types/aanmaken/content-componenten/nieuw',
	createSites: '/content-types/aanmaken/sites',
	detail: '/content-types/:contentTypeUuid',
	detailSettings: '/content-types/:contentTypeUuid/instellingen',
	detailCC: '/content-types/:contentTypeUuid/content-componenten',
	detailSites: '/content-types/:contentTypeUuid/sites',
	edit: '/content-types/:contentTypeUuid',
};
