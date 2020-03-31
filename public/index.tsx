import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React, { FC } from 'react';
import { Redirect, useLocation } from 'react-router-dom';

import ContentTypeComponents from './lib/components/ContentTypeComponents/ContentTypeComponents';
import ContentTypeSettings from './lib/components/ContentTypeSettings/ContentTypeSettings';
import ContentTypeSites from './lib/components/ContentTypeSites/ContentTypeSites';
import { generateSettingsFormState } from './lib/content-types.helpers';
import { ContentTypesCreate, ContentTypesOverview } from './lib/views';

const ContentTypesComponent: FC<{ route: ModuleRouteConfig }> = ({ route }) => {
	const location = useLocation();

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
				basePath: route.path,
				routes: route.routes,
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
			component: ContentTypesOverview as any,
		},
		{
			path: '/content-types/aanmaken',
			component: ContentTypesCreate as any,
			routes: [
				{
					path: '/content-types/aanmaken/instellingen',
					component: ContentTypeSettings as any,
				},
				{
					path: '/content-types/aanmaken/componenten',
					component: ContentTypeComponents as any,
				},
				{
					path: '/content-types/aanmaken/sites',
					component: ContentTypeSites as any,
				},
			],
		},
	],
});
