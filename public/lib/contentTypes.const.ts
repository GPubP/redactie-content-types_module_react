import { Tab, TabTypes } from './contentTypes.types';
import { DEFAULT_CONTENT_TYPES_SEARCH_PARAMS } from './services/contentTypes';

export const DEFAULT_VALIDATION_SCHEMA = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	type: 'object',
	properties: {},
};

export enum ALERT_CONTAINER_IDS {
	create = 'create',
	update = 'update',
	detailSettings = 'detail-settings',
	detailCC = 'detail-CC',
	detailSites = 'detail-sites',
}

export const CONTENT_COMPARTMENT_UUID = 'ce569384-6497-4e1b-84c6-52fa43592c69';

export const OVERVIEW_QUERY_PARAMS_CONFIG = {
	skip: { defaultValue: DEFAULT_CONTENT_TYPES_SEARCH_PARAMS.skip, type: 'number' },
	limit: { defaultValue: DEFAULT_CONTENT_TYPES_SEARCH_PARAMS.limit, type: 'number' },
	sparse: { defaultValue: DEFAULT_CONTENT_TYPES_SEARCH_PARAMS.sparse, type: 'boolean' },
	search: { type: 'string' },
	sort: { type: 'string' },
	direction: { type: 'number' },
} as const;

export const DEFAULT_OVERVIEW_QUERY_PARAMS = {
	...DEFAULT_CONTENT_TYPES_SEARCH_PARAMS,
	search: undefined,
	sort: undefined,
	direction: undefined,
};

export const CONTENT_TYPE_DETAIL_TAB_MAP: {
	[key in 'settings' | 'contentComponents' | 'sites']: Tab;
} = {
	settings: {
		name: 'Instellingen',
		target: 'instellingen',
		type: TabTypes.INTERNAL,
		active: true,
		disabled: false,
		containerId: ALERT_CONTAINER_IDS.detailSettings,
	},
	contentComponents: {
		name: 'Content Componenten',
		target: 'content-componenten',
		type: TabTypes.INTERNAL,
		active: false,
		disabled: false,
		containerId: ALERT_CONTAINER_IDS.detailCC,
	},
	sites: {
		name: 'Sites',
		target: 'sites',
		type: TabTypes.INTERNAL,
		active: false,
		disabled: false,
		containerId: ALERT_CONTAINER_IDS.detailSites,
	},
};

export const CONTENT_DETAIL_TABS: Tab[] = [
	CONTENT_TYPE_DETAIL_TAB_MAP.settings,
	CONTENT_TYPE_DETAIL_TAB_MAP.contentComponents,
	CONTENT_TYPE_DETAIL_TAB_MAP.sites,
];

export const SITE_PARAM = 'siteId';
export const SITES_ROOT = 'sites';

export const TENANT_ROOT = '/:tenantId';
const SITE_ROOT = `/:${SITE_PARAM}`;
const CC_BASE_PATH = '/content-types/:contentTypeUuid/content-componenten';
const CC_EDIT_PATH = `${CC_BASE_PATH}/:contentComponentUuid/bewerken`;
const CC_NEW_PATH = `${CC_BASE_PATH}/aanmaken`;
const CC_DYNAMIC_BASE_PATH = `${CC_EDIT_PATH}/dynamisch`;
const CC_DYNAMIC_EDIT_PATH = `${CC_DYNAMIC_BASE_PATH}/:dynamicContentComponentUuid/bewerken`;
const CC_DYNAMIC_NEW_PATH = `${CC_DYNAMIC_BASE_PATH}/aanmaken`;

export const MODULE_PATHS = {
	// TENANT
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

	detailCCEditDynamic: CC_DYNAMIC_BASE_PATH,
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

	// SITE
	site: {
		dashboard: `${SITE_ROOT}/content`,
		root: `${SITE_ROOT}/content-types`,
		overview: `${SITE_ROOT}/content-types/overzicht`,
		detail: `${SITE_ROOT}/content-types/:contentTypeUuid`,
		detailSettings: `${SITE_ROOT}/content-types/:contentTypeUuid/instellingen`,
	},
};

export const BREADCRUMB_OPTIONS = {
	excludePaths: [
		'/',
		`${TENANT_ROOT}`,
		`${TENANT_ROOT}/sites`,
		`${TENANT_ROOT}${CC_BASE_PATH}/:contentComponentUuid([0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12})`,
		`${TENANT_ROOT}${CC_DYNAMIC_BASE_PATH}`,
		`${TENANT_ROOT}${CC_DYNAMIC_BASE_PATH}/:dynamicContentComponentUuid([0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12})`,
	],
};

export const DEFAULT_VALIDATOR_ERROR_MESSAGES: Record<string, string> = {
	required: 'Dit is een verplicht veld',
	pattern: 'De opgegeven waarden heeft niet het juiste formaat',
	email: 'Gelieve een geldig e-mailadres in te vullen',
	url: 'Gelieve een geldige url in te vullen',
};

export const DYNAMIC_FIELD_SETTINGS_NAME = 'dynamicFieldSettings';
