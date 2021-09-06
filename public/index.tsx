// import { akitaDevtools } from '@datorama/akita';
import Core from '@redactie/redactie-core';
import { RenderChildRoutes, SiteContext, TenantContext } from '@redactie/utils';
import { omit } from 'ramda';
import React, { FC, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { registerContentTypeAPI } from './lib/api/index';
import {
	ContentTypeBreadcrumb,
	ContentTypeCCBreadcrumb,
	DynamicFieldBreadcrumb,
} from './lib/components/Breadcrumbs';
import { registerFields } from './lib/components/Fields';
import rolesRightsConnector from './lib/connectors/rolesRights';
import sitesConnector from './lib/connectors/sites';
import { MODULE_PATHS, SITE_PARAM } from './lib/contentTypes.const';
import { ContentTypesModuleProps, CtTypes } from './lib/contentTypes.types';
import { getPageBadges, getPageTitle, TitleTypes } from './lib/helpers';
import { registerTranslations } from './lib/i18next';
import { fieldTypesFacade } from './lib/store/fieldTypes';
import { presetsFacade } from './lib/store/presets';
import {
	ContentTypesCCConfig,
	ContentTypesCCDefaults,
	ContentTypesCCEdit,
	ContentTypesCCNew,
	ContentTypesCCSettings,
	ContentTypesCCValidation,
	ContentTypesCreate,
	ContentTypesDetailCC,
	ContentTypesDetailExternal,
	ContentTypesDetailSettings,
	ContentTypesDetailSites,
	ContentTypesDynamicCCEdit,
	ContentTypesDynamicCCNew,
	ContentTypesOverview,
	ContentTypesUpdate,
	SiteContentTypesDetailSettings,
	SiteContentTypesOverview,
	SiteContentTypesUpdate,
} from './lib/views';

// Uncomment the next line if you need to activate the redux devtools
// NOTE!: don't commit when redux devtools is active
// akitaDevtools();

const ContentTypesComponent: FC<ContentTypesModuleProps> = ({ route, tenantId }) => {
	useEffect(() => {
		fieldTypesFacade.getFieldTypes();
		presetsFacade.getPresets();
	}, []);

	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);

	/**
	 * Remove KeepActiveField state prop from the location object
	 * when we render this module for the first time or when the user refreshes the page
	 *
	 * This is needed because once the keepActiveField prop is set the browser will keep this state
	 * in memory even if the user refreshes the page.
	 *
	 * The keepActiveField state prop is used in the following views:
	 *  - ContentTypesDynaminCCNew
	 *  - ContentTypesCCNew
	 */
	const history = useHistory<{ keepActiveField?: boolean }>();
	useEffect(() => {
		if (history.location.state && history.location.state.keepActiveField) {
			const state = omit(['keepActiveField'], history.location.state);
			history.replace({ ...history.location, state });
		}
	}, [history]);

	return (
		<TenantContext.Provider value={{ tenantId }}>
			<RenderChildRoutes routes={route.routes} guardsMeta={guardsMeta} />
		</TenantContext.Provider>
	);
};

const SiteContentTypesComponent: FC<ContentTypesModuleProps<{ siteId: string }>> = ({
	match,
	route,
	tenantId,
}) => {
	const { siteId } = match.params;
	const guardsMeta = useMemo(() => ({ tenantId, siteId }), [siteId, tenantId]);

	return (
		<TenantContext.Provider value={{ tenantId }}>
			<SiteContext.Provider value={{ siteId }}>
				<RenderChildRoutes routes={route.routes} guardsMeta={guardsMeta} />
			</SiteContext.Provider>
		</TenantContext.Provider>
	);
};

if (!rolesRightsConnector.api) {
	throw new Error(
		`Content types Module can't resolve the following dependency: ${rolesRightsConnector.apiName}, please add the module to the dependency list.`
	);
}

Core.routes.register({
	path: MODULE_PATHS.root,
	component: ContentTypesComponent,
	breadcrumb: false,
	guardOptions: {
		guards: [
			rolesRightsConnector.api.guards.securityRightsTenantGuard([
				rolesRightsConnector.securityRights.read,
			]),
		],
	},
	navigation: {
		label: 'Structuur',
		order: 1,
		canShown: [
			rolesRightsConnector.api.canShowns.securityRightsTenantCanShown([
				rolesRightsConnector.securityRights.read,
			]),
		],
		params: {
			ctType: CtTypes.contentTypes,
		},
	} as any,
	redirect: MODULE_PATHS.adminContentTypes,
	routes: [
		{
			path: MODULE_PATHS.adminContentBlocks,
			breadcrumb: false,
			component: ContentTypesOverview,
			navigation: {
				label: 'Content blokken',
				order: 1,
				parentPath: MODULE_PATHS.root,
				params: {
					ctType: CtTypes.contentBlocks,
				},
			} as any,
		},
		{
			path: MODULE_PATHS.adminContentTypes,
			breadcrumb: false,
			component: ContentTypesOverview,
			navigation: {
				label: 'Content types',
				order: 0,
				parentPath: MODULE_PATHS.root,
				params: {
					ctType: CtTypes.contentTypes,
				},
			} as any,
		},
		{
			path: MODULE_PATHS.create,
			component: ContentTypesCreate,
			breadcrumb: false,
			redirect: MODULE_PATHS.createSettings,
			guardOptions: {
				guards: [
					rolesRightsConnector.api.guards.securityRightsTenantGuard([
						rolesRightsConnector.securityRights.create,
					]),
				],
			},
			routes: [
				{
					path: MODULE_PATHS.createSettings,
					breadcrumb: false,
					component: ContentTypesDetailSettings,
				},
			],
		},
		{
			path: MODULE_PATHS.detail,
			breadcrumb: false,
			guardOptions: {
				guards: [
					rolesRightsConnector.api.guards.securityRightsTenantGuard([
						rolesRightsConnector.securityRights.update,
					]),
				],
			},
			component: ContentTypesUpdate,
			redirect: MODULE_PATHS.detailSettings,
			routes: [
				{
					path: MODULE_PATHS.detailCCEditDynamicNew,
					breadcrumb: ContentTypeCCBreadcrumb,
					component: ContentTypesDynamicCCNew,
					redirect: MODULE_PATHS.detailCCEditDynamicNewSettings,
					routes: [
						{
							path: MODULE_PATHS.detailCCEditDynamicNewSettings,
							breadcrumb: DynamicFieldBreadcrumb,
							title: getPageTitle(TitleTypes.DynamicField),
							badges: getPageBadges(TitleTypes.DynamicField),
							component: ContentTypesCCSettings,
						},
						{
							path: MODULE_PATHS.detailCCEditDynamicNewConfig,
							breadcrumb: DynamicFieldBreadcrumb,
							title: getPageTitle(TitleTypes.DynamicField),
							badges: getPageBadges(TitleTypes.DynamicField),
							component: ContentTypesCCConfig,
						},
						{
							path: MODULE_PATHS.detailCCEditDynamicNewValidation,
							breadcrumb: DynamicFieldBreadcrumb,
							title: getPageTitle(TitleTypes.DynamicField),
							badges: getPageBadges(TitleTypes.DynamicField),
							component: ContentTypesCCValidation,
						},
						{
							path: MODULE_PATHS.detailCCEditDynamicNewDefaults,
							breadcrumb: DynamicFieldBreadcrumb,
							title: getPageTitle(TitleTypes.DynamicField),
							badges: getPageBadges(TitleTypes.DynamicField),
							component: ContentTypesCCDefaults,
						},
					],
				},
				{
					path: MODULE_PATHS.detailCCEditDynamicEdit,
					breadcrumb: ContentTypeCCBreadcrumb,
					component: ContentTypesDynamicCCEdit,
					redirect: MODULE_PATHS.detailCCEditDynamicEditSettings,
					routes: [
						{
							path: MODULE_PATHS.detailCCEditDynamicEditSettings,
							breadcrumb: DynamicFieldBreadcrumb,
							title: getPageTitle(TitleTypes.DynamicField),
							badges: getPageBadges(TitleTypes.DynamicField),
							component: ContentTypesCCSettings,
						},
						{
							path: MODULE_PATHS.detailCCEditDynamicEditConfig,
							breadcrumb: DynamicFieldBreadcrumb,
							title: getPageTitle(TitleTypes.DynamicField),
							badges: getPageBadges(TitleTypes.DynamicField),
							component: ContentTypesCCConfig,
						},
						{
							path: MODULE_PATHS.detailCCEditDynamicEditValidation,
							breadcrumb: DynamicFieldBreadcrumb,
							title: getPageTitle(TitleTypes.DynamicField),
							badges: getPageBadges(TitleTypes.DynamicField),
							component: ContentTypesCCValidation,
						},
						{
							path: MODULE_PATHS.detailCCEditDynamicEditDefaults,
							breadcrumb: DynamicFieldBreadcrumb,
							title: getPageTitle(TitleTypes.DynamicField),
							badges: getPageBadges(TitleTypes.DynamicField),
							component: ContentTypesCCDefaults,
						},
					],
				},
				{
					path: MODULE_PATHS.detailCCNew,
					breadcrumb: ContentTypeBreadcrumb,
					component: ContentTypesCCNew,
					redirect: MODULE_PATHS.detailCCNewSettings,
					routes: [
						{
							path: MODULE_PATHS.detailCCNewSettings,
							breadcrumb: ContentTypeCCBreadcrumb,
							title: getPageTitle(TitleTypes.Field),
							badges: getPageBadges(TitleTypes.Field),
							component: ContentTypesCCSettings,
						},
						{
							path: MODULE_PATHS.detailCCNewConfig,
							breadcrumb: ContentTypeCCBreadcrumb,
							title: getPageTitle(TitleTypes.Field),
							badges: getPageBadges(TitleTypes.Field),
							component: ContentTypesCCConfig,
						},
						{
							path: MODULE_PATHS.detailCCNewValidation,
							breadcrumb: ContentTypeCCBreadcrumb,
							title: getPageTitle(TitleTypes.Field),
							badges: getPageBadges(TitleTypes.Field),
							component: ContentTypesCCValidation,
						},
						{
							path: MODULE_PATHS.detailCCNewDefaults,
							breadcrumb: ContentTypeCCBreadcrumb,
							title: getPageTitle(TitleTypes.Field),
							badges: getPageBadges(TitleTypes.Field),
							component: ContentTypesCCDefaults,
						},
					],
				},
				{
					path: MODULE_PATHS.detailCCEdit,
					breadcrumb: ContentTypeBreadcrumb,
					component: ContentTypesCCEdit,
					redirect: MODULE_PATHS.detailCCEditSettings,
					routes: [
						{
							path: MODULE_PATHS.detailCCEditSettings,
							breadcrumb: ContentTypeCCBreadcrumb,
							title: getPageTitle(TitleTypes.Field),
							badges: getPageBadges(TitleTypes.Field),
							component: ContentTypesCCSettings,
						},
						{
							path: MODULE_PATHS.detailCCEditConfig,
							breadcrumb: ContentTypeCCBreadcrumb,
							title: getPageTitle(TitleTypes.Field),
							badges: getPageBadges(TitleTypes.Field),
							component: ContentTypesCCConfig,
						},
						{
							path: MODULE_PATHS.detailCCEditValidation,
							breadcrumb: ContentTypeCCBreadcrumb,
							title: getPageTitle(TitleTypes.Field),
							badges: getPageBadges(TitleTypes.Field),
							component: ContentTypesCCValidation,
						},
						{
							path: MODULE_PATHS.detailCCEditDefaults,
							breadcrumb: ContentTypeCCBreadcrumb,
							title: getPageTitle(TitleTypes.Field),
							badges: getPageBadges(TitleTypes.Field),
							component: ContentTypesCCDefaults,
						},
					],
				},
				{
					path: MODULE_PATHS.detailSettings,
					breadcrumb: false,
					title: getPageTitle(TitleTypes.ContentType),
					badges: getPageBadges(TitleTypes.ContentType),
					component: ContentTypesDetailSettings,
				},
				{
					path: MODULE_PATHS.detailCC,
					breadcrumb: false,
					title: getPageTitle(TitleTypes.ContentType),
					badges: getPageBadges(TitleTypes.ContentType),
					component: ContentTypesDetailCC,
				},
				{
					path: MODULE_PATHS.detailSites,
					breadcrumb: false,
					title: getPageTitle(TitleTypes.ContentType),
					badges: getPageBadges(TitleTypes.ContentType),
					component: ContentTypesDetailSites,
				},
				{
					path: MODULE_PATHS.detailExternal,
					breadcrumb: false,
					title: getPageTitle(TitleTypes.ContentType),
					badges: getPageBadges(TitleTypes.ContentType),
					component: ContentTypesDetailExternal,
				},
			],
		},
	],
});

sitesConnector.registerRoutes({
	path: MODULE_PATHS.site.root,
	breadcrumb: false,
	component: SiteContentTypesComponent,
	redirect: MODULE_PATHS.site.overview,
	guards: [
		rolesRightsConnector.api.guards.securityRightsSiteGuard(SITE_PARAM, [
			rolesRightsConnector.securityRights.read,
		]),
	],
	navigation: {
		renderContext: 'site',
		context: 'site',
		label: 'Structuur',
		order: 1,
		canShown: [
			rolesRightsConnector.api.canShowns.securityRightsSiteCanShown(SITE_PARAM, [
				rolesRightsConnector.securityRights.read,
			]),
		],
	},
	routes: [
		{
			path: MODULE_PATHS.site.overview,
			breadcrumb: false,
			component: SiteContentTypesOverview,
			navigation: {
				context: 'site',
				label: 'Content types',
				order: 0,
				parentPath: MODULE_PATHS.site.root,
			},
		},
		{
			path: MODULE_PATHS.site.detail,
			breadcrumb: false,
			component: SiteContentTypesUpdate,
			redirect: MODULE_PATHS.site.detailSettings,
			routes: [
				{
					path: MODULE_PATHS.site.detailSettings,
					breadcrumb: false,
					title: getPageTitle(TitleTypes.ContentType),
					badges: getPageBadges(TitleTypes.ContentType),
					component: SiteContentTypesDetailSettings,
				},
			],
		},
	],
});

registerTranslations();
registerContentTypeAPI();
registerFields();

export * from './lib/api/api.types';
