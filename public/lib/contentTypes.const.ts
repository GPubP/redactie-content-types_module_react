import { Tab, TabTypes } from './contentTypes.types';

export const BREADCRUMB_OPTIONS = {
	excludePaths: [
		'/',
		'/:tenantId',
		'/:tenantId/content-types/:contentTypeUuid/content-componenten/:contentComponentUuid',
		'/:tenantId/content-types/:contentTypeUuid/content-componenten/:contentComponentUuid/bewerken',
	],
};

export const DEFAULT_VALIDATION_SCHEMA = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	type: 'object',
	properties: {},
};

export const CONTENT_TYPE_DETAIL_TAB_MAP: {
	[key in 'settings' | 'contentComponents' | 'sites']: Tab;
} = {
	settings: {
		name: 'Instellingen',
		target: 'instellingen',
		type: TabTypes.INTERNAL,
		active: true,
	},
	contentComponents: {
		name: 'Content Componenten',
		target: 'content-componenten',
		type: TabTypes.INTERNAL,
		active: false,
	},
	sites: {
		name: 'Sites',
		target: 'sites',
		type: TabTypes.INTERNAL,
		active: false,
	},
};

export const CONTENT_DETAIL_TABS: Tab[] = [
	CONTENT_TYPE_DETAIL_TAB_MAP.settings,
	CONTENT_TYPE_DETAIL_TAB_MAP.contentComponents,
	CONTENT_TYPE_DETAIL_TAB_MAP.sites,
];

const CC_EDIT_PATH =
	'/content-types/:contentTypeUuid/content-componenten/:contentComponentUuid/bewerken';
const CC_NEW_PATH = '/content-types/:contentTypeUuid/content-componenten/nieuw';
const CC_DYNAMIC_EDIT_PATH = `${CC_EDIT_PATH}/dynamisch/:dynamicContentComponentUuid/bewerken`;
const CC_DYNAMIC_NEW_PATH = `${CC_EDIT_PATH}/dynamisch/nieuw`;

export const MODULE_PATHS = {
	dashboard: '/dashboard',
	root: '/content-types',
	admin: '/content-types/beheer',

	create: '/content-types/aanmaken',
	createSettings: '/content-types/aanmaken/instellingen',

	detail: '/content-types/:contentTypeUuid',
	detailSettings: '/content-types/:contentTypeUuid/instellingen',
	detailCC: '/content-types/:contentTypeUuid/content-componenten',
	detailSites: '/content-types/:contentTypeUuid/sites',
	detailExternal: '/content-types/:contentTypeUuid/:tab',

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

	detailCCEditDynamicNew: CC_DYNAMIC_NEW_PATH,
	detailCCEditDynamicNewSettings: `${CC_DYNAMIC_NEW_PATH}/instellingen`,
	detailCCEditDynamicNewConfig: `${CC_DYNAMIC_NEW_PATH}/configuratie`,
	detailCCEditDynamicNewValidation: `${CC_DYNAMIC_NEW_PATH}/validatie`,
	detailCCEditDynamicNewDefaults: `${CC_DYNAMIC_NEW_PATH}/standaard-waarde`,

	detailCCEditDynamicEdit: CC_DYNAMIC_EDIT_PATH,
	detailCCEditDynamicEditSettings: `${CC_DYNAMIC_EDIT_PATH}/instellingen`,
	detailCCEditDynamicEditConfig: `${CC_DYNAMIC_EDIT_PATH}/configuratie`,
	detailCCEditDynamicEditValidation: `${CC_DYNAMIC_EDIT_PATH}/validatie`,
	detailCCEditDynamicEditDefaults: `${CC_DYNAMIC_EDIT_PATH}/standaard-waarde`,
};

export const DEFAULT_VALIDATOR_ERROR_MESSAGES: Record<string, string> = {
	required: 'Dit is een verplicht veld',
	pattern: 'De opgegeven waarden heeft niet het juiste formaat',
	email: 'Gelieve een geldig e-mailadres in te vullen',
	url: 'Gelieve een geldige url in te vullen',
};
