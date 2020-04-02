import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React, { createContext, FC } from 'react';
import { Redirect } from 'react-router-dom';

import { MODULE_PATHS } from './lib/contentTypes.const';
import { ContentTypesRouteProps } from './lib/contentTypes.types';
import { ContentTypesCreate, ContentTypesOverview } from './lib/views';
import ContentTypeDetailCC from './lib/views/ContentTypeDetailCC/ContentTypeDetailCC';
import ContentTypeDetailSettings from './lib/views/ContentTypeDetailSettings/ContentTypeDetailSettings';
import ContentTypeDetailSites from './lib/views/ContentTypeDetailSites/ContentTypeDetailSites';
import ContentTypesUpdate from './lib/views/ContentTypeUpdate/ContentTypeUpdate';

export const TenantContext = createContext('');

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
		<TenantContext.Provider value={tenantId}>
			{Core.routes.render(route.routes as ModuleRouteConfig[], {
				basePath: match.url,
				routes: route.routes,
				tenantId: tenantId,
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
					component: ContentTypeDetailSettings,
				},
				{
					path: MODULE_PATHS.createCC,
					component: ContentTypeDetailCC,
				},
				{
					path: MODULE_PATHS.createSites,
					component: ContentTypeDetailSites,
				},
			],
		},
		{
			path: MODULE_PATHS.detail,
			component: ContentTypesUpdate,
			routes: [
				{
					path: MODULE_PATHS.detailSettings,
					component: ContentTypeDetailSettings,
				},
				{
					path: MODULE_PATHS.detailCC,
					component: ContentTypeDetailCC,
				},
				{
					path: MODULE_PATHS.detailSites,
					component: ContentTypeDetailSites,
				},
			],
		},
	],
});
