import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React, { FC } from 'react';
import { Redirect } from 'react-router-dom';

import { ContentTypesRouteProps } from './lib/contentTypes.types';
import { ContentTypesCreate, ContentTypesOverview } from './lib/views';
import ContentTypeDetailCC from './lib/views/ContentTypeDetailCC/ContentTypeDetailCC';
import ContentTypeDetailSettings from './lib/views/ContentTypeDetailSettings/ContentTypeDetailSettings';
import ContentTypeDetailSites from './lib/views/ContentTypeDetailSites/ContentTypeDetailSites';
import ContentTypesUpdate from './lib/views/ContentTypeUpdate/ContentTypeUpdate';

const ContentTypesComponent: FC<ContentTypesRouteProps> = ({
	route,
	match,
	location,
	tenantId,
}) => {
	// if path is /content-types, redirect to /content-types/beheer
	if (/\/content-types$/.test(location.pathname)) {
		return <Redirect to={`/${tenantId}/content-types/beheer`} />;
	}

	// if path is /content-types/aanmaken, redirect to /content-types/aanmaken/instellingen
	if (/\/content-types\/aanmaken$/.test(location.pathname)) {
		return <Redirect to={`/${tenantId}/content-types/aanmaken/instellingen`} />;
	}

	if (
		/\/content-types\/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b$/.test(
			location.pathname
		)
	) {
		return <Redirect to={`${location.pathname}/instellingen`} />;
	}

	return (
		<>
			{Core.routes.render(route.routes as ModuleRouteConfig[], {
				basePath: match.url,
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
					component: ContentTypeDetailSettings,
				},
				{
					path: '/content-types/aanmaken/content-componenten',
					component: ContentTypeDetailCC,
				},
				{
					path: '/content-types/aanmaken/sites',
					component: ContentTypeDetailSites,
				},
			],
		},
		{
			path: '/content-types/:contentTypeUuid',
			component: ContentTypesUpdate,
			routes: [
				{
					path: '/content-types/:contentTypeUuid/instellingen',
					component: ContentTypeDetailSettings,
				},
				{
					path: '/content-types/:contentTypeUuid/content-componenten',
					component: ContentTypeDetailCC,
				},
				{
					path: '/content-types/:contentTypeUuid/sites',
					component: ContentTypeDetailSites,
				},
			],
		},
	],
});
