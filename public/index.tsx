import { akitaDevtools } from '@datorama/akita';
import Core from '@redactie/redactie-core';
import React, { FC, useEffect, useMemo } from 'react';

import { registerContentTypeAPI } from './lib/api/index';
import { RenderChildRoutes } from './lib/components';
import DynamicFieldSettings from './lib/components/fields/DynamicFieldSettings/DynamicFieldSettings';
import formRendererConnector from './lib/connectors/formRenderer';
import rolesRightsConnector from './lib/connectors/rolesRights';
import { MODULE_PATHS } from './lib/contentTypes.const';
import { ContentTypesModuleProps } from './lib/contentTypes.types';
import { TenantContext } from './lib/context';
import { fieldTypesFacade } from './lib/store/fieldTypes';
import { presetsFacade } from './lib/store/presets';
import { sitesFacade } from './lib/store/sites';
import {
	ContentTypeDetailExternal,
	ContentTypesCCConfig,
	ContentTypesCCDefaults,
	ContentTypesCCEdit,
	ContentTypesCCNew,
	ContentTypesCCSettings,
	ContentTypesCCValidation,
	ContentTypesCreate,
	ContentTypesDetailCC,
	ContentTypesDetailSettings,
	ContentTypesDetailSites,
	ContentTypesDynamicCCEdit,
	ContentTypesDynamicCCNew,
	ContentTypesOverview,
	ContentTypesUpdate,
} from './lib/views';

akitaDevtools();

const ContentTypesComponent: FC<ContentTypesModuleProps> = ({ route, tenantId }) => {
	useEffect(() => {
		fieldTypesFacade.getFieldTypes();
		presetsFacade.getPresets();
		sitesFacade.getSites();
	}, []);

	const guardsMeta = useMemo(
		() => ({
			tenantId,
		}),
		[tenantId]
	);

	return (
		<TenantContext.Provider value={{ tenantId }}>
			<RenderChildRoutes routes={route.routes} guardsMeta={guardsMeta} />
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
			routes: [
				{
					path: MODULE_PATHS.detailCCEditDynamicNew,
					breadcrumb: 'Vrije paragraaf',
					component: ContentTypesDynamicCCNew,
					routes: [
						{
							path: MODULE_PATHS.detailCCEditDynamicNewSettings,
							component: ContentTypesCCSettings,
						},
						{
							path: MODULE_PATHS.detailCCEditDynamicNewConfig,
							component: ContentTypesCCConfig,
						},
						{
							path: MODULE_PATHS.detailCCEditDynamicNewValidation,
							component: ContentTypesCCValidation,
						},
						{
							path: MODULE_PATHS.detailCCEditDynamicNewDefaults,
							component: ContentTypesCCDefaults,
						},
					],
				},
				{
					path: MODULE_PATHS.detailCCEditDynamicEdit,
					breadcrumb: 'Vrije paragraaf',
					component: ContentTypesDynamicCCEdit,
					redirect: MODULE_PATHS.detailCCEditDynamicEditSettings,
					routes: [
						{
							path: MODULE_PATHS.detailCCEditDynamicEditSettings,
							component: ContentTypesCCSettings,
						},
						{
							path: MODULE_PATHS.detailCCEditDynamicEditConfig,
							component: ContentTypesCCConfig,
						},
						{
							path: MODULE_PATHS.detailCCEditDynamicEditValidation,
							component: ContentTypesCCValidation,
						},
						{
							path: MODULE_PATHS.detailCCEditDynamicEditDefaults,
							breadcrumb: 'Vrije paragraaf',
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
							component: ContentTypesCCSettings,
						},
						{
							path: MODULE_PATHS.detailCCNewConfig,
							component: ContentTypesCCConfig,
						},
						{
							path: MODULE_PATHS.detailCCNewValidation,
							component: ContentTypesCCValidation,
						},
						{
							path: MODULE_PATHS.detailCCNewDefaults,
							component: ContentTypesCCDefaults,
						},
					],
				},
				{
					path: MODULE_PATHS.detailCCEdit,
					breadcrumb: null,
					component: ContentTypesCCEdit,
					redirect: MODULE_PATHS.detailCCEditSettings,
					routes: [
						{
							path: MODULE_PATHS.detailCCEditSettings,
							component: ContentTypesCCSettings,
						},
						{
							path: MODULE_PATHS.detailCCEditConfig,
							component: ContentTypesCCConfig,
						},
						{
							path: MODULE_PATHS.detailCCEditValidation,
							component: ContentTypesCCValidation,
						},
						{
							path: MODULE_PATHS.detailCCEditDefaults,
							component: ContentTypesCCDefaults,
						},
					],
				},
				{
					path: MODULE_PATHS.detailSettings,
					component: ContentTypesDetailSettings,
				},
				{
					path: MODULE_PATHS.detailCC,
					component: ContentTypesDetailCC,
				},
				{
					path: MODULE_PATHS.detailSites,
					component: ContentTypesDetailSites,
				},
				{
					path: MODULE_PATHS.detailExternal,
					component: ContentTypeDetailExternal,
				},
			],
		},
	],
});

registerContentTypeAPI();

formRendererConnector.api.fieldRegistry.add({
	name: 'dynamicFieldSettings',
	module: 'content-types',
	component: DynamicFieldSettings,
});

export * from './lib/api/api.types';
