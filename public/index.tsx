// import { akitaDevtools } from '@datorama/akita';
import Core from '@redactie/redactie-core';
import { RenderChildRoutes, SiteContext, TenantContext } from '@redactie/utils';
import { omit } from 'ramda';
import React, { FC, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { registerContentTypeAPI } from './lib/api/index';
import { ContentTypesSelect, DynamicFieldSettings } from './lib/components/Fields';
import formRendererConnector from './lib/connectors/formRenderer';
import rolesRightsConnector from './lib/connectors/rolesRights';
import sitesConnector from './lib/connectors/sites';
import { DYNAMIC_FIELD_SETTINGS_NAME, MODULE_PATHS } from './lib/contentTypes.const';
import { ContentTypesModuleProps } from './lib/contentTypes.types';
import { contentTypeTitleHelper } from './lib/helpers/contentTypeTitleHelper/contentTypeTitleHelper';
import { TitleTypes } from './lib/helpers/contentTypeTitleHelper/contentTypeTitleHelper.types';
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
		sitesConnector.sitesFacade.getSites();
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
	breadcrumb: null,
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
	},
	redirect: MODULE_PATHS.admin,
	routes: [
		{
			path: MODULE_PATHS.admin,
			component: ContentTypesOverview,
			navigation: {
				label: 'Content types',
				order: 0,
				parentPath: MODULE_PATHS.root,
			},
		},
		{
			path: MODULE_PATHS.create,
			component: ContentTypesCreate,
			breadcrumb: null,
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
					component: ContentTypesDetailSettings,
				},
			],
		},
		{
			path: MODULE_PATHS.detail,
			breadcrumb: null,
			guardOptions: {
				guards: [
					rolesRightsConnector.api.guards.securityRightsTenantGuard([
						rolesRightsConnector.securityRights.update,
					]),
				],
			},
			component: ContentTypesUpdate,
			redirect: MODULE_PATHS.detailSettings,
			title: 'test',
			routes: [
				{
					path: MODULE_PATHS.detailCCEditDynamicNew,
					breadcrumb: null,
					component: ContentTypesDynamicCCNew,
					redirect: MODULE_PATHS.detailCCEditDynamicNewSettings,
					routes: [
						{
							path: MODULE_PATHS.detailCCEditDynamicNewSettings,
							title: contentTypeTitleHelper(TitleTypes.DynamicField),
							component: ContentTypesCCSettings,
						},
						{
							path: MODULE_PATHS.detailCCEditDynamicNewConfig,
							title: contentTypeTitleHelper(TitleTypes.DynamicField),
							component: ContentTypesCCConfig,
						},
						{
							path: MODULE_PATHS.detailCCEditDynamicNewValidation,
							title: contentTypeTitleHelper(TitleTypes.DynamicField),
							component: ContentTypesCCValidation,
						},
						{
							path: MODULE_PATHS.detailCCEditDynamicNewDefaults,
							title: contentTypeTitleHelper(TitleTypes.DynamicField),
							component: ContentTypesCCDefaults,
						},
					],
				},
				{
					path: MODULE_PATHS.detailCCEditDynamicEdit,
					breadcrumb: null,
					component: ContentTypesDynamicCCEdit,
					redirect: MODULE_PATHS.detailCCEditDynamicEditSettings,
					routes: [
						{
							path: MODULE_PATHS.detailCCEditDynamicEditSettings,
							title: contentTypeTitleHelper(TitleTypes.DynamicField),
							component: ContentTypesCCSettings,
						},
						{
							path: MODULE_PATHS.detailCCEditDynamicEditConfig,
							title: contentTypeTitleHelper(TitleTypes.DynamicField),
							component: ContentTypesCCConfig,
						},
						{
							path: MODULE_PATHS.detailCCEditDynamicEditValidation,
							title: contentTypeTitleHelper(TitleTypes.DynamicField),
							component: ContentTypesCCValidation,
						},
						{
							path: MODULE_PATHS.detailCCEditDynamicEditDefaults,
							title: contentTypeTitleHelper(TitleTypes.DynamicField),
							component: ContentTypesCCDefaults,
						},
					],
				},
				{
					path: MODULE_PATHS.detailCCNew,
					breadcrumb: 'Vrije paragraaf',
					component: ContentTypesCCNew,
					redirect: MODULE_PATHS.detailCCNewSettings,
					routes: [
						{
							path: MODULE_PATHS.detailCCNewSettings,
							title: contentTypeTitleHelper(TitleTypes.Field),
							component: ContentTypesCCSettings,
						},
						{
							path: MODULE_PATHS.detailCCNewConfig,
							title: contentTypeTitleHelper(TitleTypes.Field),
							component: ContentTypesCCConfig,
						},
						{
							path: MODULE_PATHS.detailCCNewValidation,
							title: contentTypeTitleHelper(TitleTypes.Field),
							component: ContentTypesCCValidation,
						},
						{
							path: MODULE_PATHS.detailCCNewDefaults,
							title: contentTypeTitleHelper(TitleTypes.Field),
							component: ContentTypesCCDefaults,
						},
					],
				},
				{
					path: MODULE_PATHS.detailCCEdit,
					breadcrumb: 'Vrije paragraaf',
					component: ContentTypesCCEdit,
					redirect: MODULE_PATHS.detailCCEditSettings,
					routes: [
						{
							path: MODULE_PATHS.detailCCEditSettings,
							title: contentTypeTitleHelper(TitleTypes.Field),
							component: ContentTypesCCSettings,
						},
						{
							path: MODULE_PATHS.detailCCEditConfig,
							title: contentTypeTitleHelper(TitleTypes.Field),
							component: ContentTypesCCConfig,
						},
						{
							path: MODULE_PATHS.detailCCEditValidation,
							title: contentTypeTitleHelper(TitleTypes.Field),
							component: ContentTypesCCValidation,
						},
						{
							path: MODULE_PATHS.detailCCEditDefaults,
							title: contentTypeTitleHelper(TitleTypes.Field),
							component: ContentTypesCCDefaults,
						},
					],
				},
				{
					path: MODULE_PATHS.detailSettings,
					title: contentTypeTitleHelper(TitleTypes.ContentType),
					component: ContentTypesDetailSettings,
				},
				{
					path: MODULE_PATHS.detailCC,
					title: contentTypeTitleHelper(TitleTypes.ContentType),
					component: ContentTypesDetailCC,
				},
				{
					path: MODULE_PATHS.detailSites,
					title: contentTypeTitleHelper(TitleTypes.ContentType),
					component: ContentTypesDetailSites,
				},
				{
					path: MODULE_PATHS.detailExternal,
					title: contentTypeTitleHelper(TitleTypes.ContentType),
					component: ContentTypesDetailExternal,
				},
			],
		},
	],
});

sitesConnector.registerRoutes({
	path: MODULE_PATHS.site.root,
	component: SiteContentTypesComponent,
	redirect: MODULE_PATHS.site.overview,
	navigation: {
		renderContext: 'site',
		context: 'site',
		label: 'Structuur',
		order: 1,
	},
	routes: [
		{
			path: MODULE_PATHS.site.overview,
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
			breadcrumb: null,
			component: SiteContentTypesUpdate,
			redirect: MODULE_PATHS.site.detailSettings,
			routes: [
				{
					path: MODULE_PATHS.site.detailSettings,
					title: contentTypeTitleHelper(TitleTypes.ContentType),
					component: SiteContentTypesDetailSettings,
				},
			],
		},
	],
});

registerContentTypeAPI();

formRendererConnector.api.fieldRegistry.add({
	name: DYNAMIC_FIELD_SETTINGS_NAME,
	module: 'content-types',
	component: DynamicFieldSettings,
});

formRendererConnector.api.fieldRegistry.add({
	name: 'contentTypesSelect',
	module: 'content-types',
	component: ContentTypesSelect,
});

export * from './lib/api/api.types';
