import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React, { FC } from 'react';
import { Redirect } from 'react-router-dom';

import ContentTypeComponents from './lib/components/ContentTypeComponents/ContentTypeComponents';
import ContentTypeSettings from './lib/components/ContentTypeSettings/ContentTypeSettings';
import ContentTypeSites from './lib/components/ContentTypeSites/ContentTypeSites';
import { ContentTypesRouteProps } from './lib/content-types.types';
import { ContentTypesCreate, ContentTypesOverview } from './lib/views';

const ContentTypesComponent: FC<ContentTypesRouteProps> = ({
	route,
	match,
	location,
	tenantId,
}) => {
	// if path is /content-types, redirect to /content-types/beheer
	if (/\/content-types$/.test(location.pathname)) {
		return <Redirect to={`${route.path}/beheer`} />;
	}

	// if path is /content-types/aanmaken, redirect to /content-types/aanmaken/instellingen
	if (/\/content-types\/aanmaken$/.test(location.pathname)) {
		return <Redirect to={`${route.path}/aanmaken/instellingen`} />;
	}

	return (
		<>
			{Core.routes.render(route.routes as ModuleRouteConfig[], {
				basePath: match.path,
				routes: route.routes,
				tenantId: tenantId,
			})}
		</>
	);
};

Core.routes.register({
	path: '/content-types',
	label: 'Content types',
	component: ContentTypesComponent,
	exact: true,
	routes: [
		{
			path: '/content-types/beheer',
			component: ContentTypesOverview,
		},
		{
			path: '/content-types/aanmaken',
			component: ContentTypesCreate,
			routes: [
				{
					path: '/content-types/aanmaken/instellingen',
					component: ContentTypeSettings,
				},
				{
					path: '/content-types/aanmaken/content-componenten',
					component: ContentTypeComponents,
				},
				{
					path: '/content-types/aanmaken/sites',
					component: ContentTypeSites,
				},
			],
		},
	],
});
