import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React, { FC } from 'react';
import { Redirect } from 'react-router-dom';

import { MODULE_PATHS } from './lib/contentTypes.const';
import { ContentTypesRouteProps } from './lib/contentTypes.types';
import { TenantContext } from './lib/context';
import {
	ContentTypesCCForm,
	ContentTypesCCNew,
	ContentTypesCCSettings,
	ContentTypesCreate,
	ContentTypesDetailCC,
	ContentTypesDetailSettings,
	ContentTypesDetailSites,
	ContentTypesOverview,
	ContentTypesUpdate,
} from './lib/views';

const ContentTypesComponent: FC<ContentTypesRouteProps> = ({
	route,
	match,
	location,
	tenantId,
}) => {
	// if path is /content-types, redirect to /content-types/beheer
	if (/\/content-types$/.test(location.pathname)) {
		return <Redirect to={`/${tenantId}${MODULE_PATHS.admin}`} />;
	}

	// if path is /content-types/aanmaken, redirect to /content-types/aanmaken/instellingen
	if (/\/content-types\/aanmaken$/.test(location.pathname)) {
		return <Redirect to={`/${tenantId}${MODULE_PATHS.createSettings}`} />;
	}

	if (
		/\/content-types\/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b$/.test(
			location.pathname
		)
	) {
		return <Redirect to={`${location.pathname}/instellingen`} />;
	}

	return (
		<TenantContext.Provider value={{ tenantId }}>
			{Core.routes.render(route.routes as ModuleRouteConfig[], {
				basePath: match.url,
				routes: route.routes,
			})}
		</TenantContext.Provider>
	);
};

Core.routes.register({
	path: MODULE_PATHS.root,
	label: 'Content types',
	component: ContentTypesComponent,
	exact: true,
	routes: [
		{
			path: MODULE_PATHS.admin,
			component: ContentTypesOverview,
		},
		{
			path: MODULE_PATHS.create,
			component: ContentTypesCreate,
			routes: [
				{
					path: MODULE_PATHS.createSettings,
					component: ContentTypesDetailSettings,
				},
				{
					path: MODULE_PATHS.createCCNew,
					component: ContentTypesCCNew,
					routes: [
						{
							path: MODULE_PATHS.createCCNewSettings,
							component: ContentTypesCCSettings,
						},
						{
							path: MODULE_PATHS.createCCNewConfig,
							component: ContentTypesCCForm,
						},
						{
							path: MODULE_PATHS.createCCNewValidation,
							component: ContentTypesCCForm,
						},
						// TODO: add new CC defaults view
						// {
						// 	path: MODULE_PATHS.createCCNewDefaults,
						// 	component: () => null,
						// },
					],
				},
				{
					path: MODULE_PATHS.createCC,
					component: ContentTypesDetailCC,
					exact: true,
				},
				{
					path: MODULE_PATHS.createSites,
					component: ContentTypesDetailSites,
				},
			],
		},
		{
			path: MODULE_PATHS.detail,
			component: ContentTypesUpdate,
			routes: [
				{
					path: MODULE_PATHS.detailCCEdit,
					component: ContentTypesCCNew,
					routes: [
						{
							path: MODULE_PATHS.detailCCEditSettings,
							component: ContentTypesCCSettings,
						},
						{
							path: MODULE_PATHS.detailCCEditConfig,
							component: ContentTypesCCForm,
						},
						{
							path: MODULE_PATHS.detailCCEditValidation,
							component: ContentTypesCCForm,
						},
						// TODO: add edit CC defaults view
						// {
						// 	path: MODULE_PATHS.detailCCEditDefaults,
						// 	component: () => null,
						// },
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
					path: MODULE_PATHS.detailCC,
					component: ContentTypesDetailCC,
				},
				{
					path: MODULE_PATHS.detailSites,
					component: ContentTypesDetailSites,
				},
			],
		},
	],
});
