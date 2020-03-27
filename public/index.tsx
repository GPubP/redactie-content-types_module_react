import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React, { FC } from 'react';
import { Redirect, useLocation } from 'react-router-dom';

import { ContentTypesOverview } from './lib/views';

const ContentTypesComponent: FC<{ route: ModuleRouteConfig }> = ({ route }) => {
	const location = useLocation();

	// if path is /content-types, redirect to /content-types/beheer
	if (/\/content-types$/.test(location.pathname)) {
		return <Redirect to={`${route.path}/beheer`} />;
	}

	return <>{Core.routes.render(route.routes as ModuleRouteConfig[])}</>;
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
	],
});
