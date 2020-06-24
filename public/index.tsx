// import { akitaDevtools } from '@datorama/akita';
import Core from '@redactie/redactie-core';
import React, { FC, useMemo } from 'react';

import { registerContentTypeAPI } from './lib/api/index';
import { ContentTypeDetailBreadcrumb, RenderChildRoutes } from './lib/components';
import rolesRightsConnector from './lib/connectors/rolesRights';
import { MODULE_PATHS } from './lib/contentTypes.const';
import { ContentTypesModuleProps } from './lib/contentTypes.types';
import { TenantContext } from './lib/context';
import {
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
	ContentTypesOverview,
	ContentTypesUpdate,
} from './lib/views';
import ContentTypeDetailExternal from './lib/views/ContentTypeDetailExternal/ContentTypeDetailExternal';

// akitaDevtools();

const ContentTypesComponent: FC<ContentTypesModuleProps> = ({ route, tenantId }) => {
	const guardsMeta = useMemo(
		() => ({
			tenantId,
		}),
		[tenantId]
	);
	const extraOptions = useMemo(
		() => ({
			routes: route.routes,
		}),
		[route.routes]
	);

	return (
		<TenantContext.Provider value={{ tenantId }}>
			<RenderChildRoutes
				routes={route.routes}
				guardsMeta={guardsMeta}
				extraOptions={extraOptions}
			/>
		</TenantContext.Provider>
	);
};

if (rolesRightsConnector.api) {
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
				breadcrumb: ContentTypeDetailBreadcrumb,
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
						path: MODULE_PATHS.detailCCNew,
						breadcrumb: null,
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
} else {
	throw new Error(
		`Content types Module can't resolve the following dependency: ${rolesRightsConnector.apiName}, please add the module to the dependency list.`
	);
}

registerContentTypeAPI();

export * from './lib/api/api.types';
