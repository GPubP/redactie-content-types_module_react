import { Button } from '@acpaas-ui/react-components';
import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React, { FC } from 'react';
import { Redirect } from 'react-router-dom';

import { ContentTypeAPI } from './lib/api/api.types';
import { registerContentTypeAPI } from './lib/api/index';
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
import { ExternalTabProps } from './lib/views/ContentTypeDetailExternal/ContentTypeDetailExternal.types';

const ContentTypesComponent: FC<ContentTypesModuleProps> = ({
	route,
	match,
	location,
	tenantId,
}) => {
	const uuidRegex = '\\b[0-9a-f]{8}\\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\\b[0-9a-f]{12}\\b';

	// if path is /content-types, redirect to /content-types/beheer
	if (/\/content-types$/.test(location.pathname)) {
		return <Redirect to={`/${tenantId}${MODULE_PATHS.admin}`} />;
	}

	// if path is /content-types/aanmaken, redirect to /content-types/aanmaken/instellingen
	if (/\/content-types\/aanmaken$/.test(location.pathname)) {
		return <Redirect to={`/${tenantId}${MODULE_PATHS.createSettings}`} />;
	}

	if (new RegExp(`/content-types/${uuidRegex}$`).test(location.pathname)) {
		return <Redirect to={`${location.pathname}/instellingen`} />;
	}

	if (
		new RegExp(`/content-types/${uuidRegex}/content-componenten/(nieuw|bewerken)$`).test(
			location.pathname
		)
	) {
		return <Redirect to={`${location.pathname}/instellingen${location.search}`} />;
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
	component: ContentTypesComponent,
	navigation: {
		label: 'Structuur',
	},
	exact: true,
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
			routes: [
				{
					path: MODULE_PATHS.createSettings,
					component: ContentTypesDetailSettings,
				},
			],
		},
		{
			path: MODULE_PATHS.detail,
			component: ContentTypesUpdate,
			routes: [
				{
					path: MODULE_PATHS.detailCCNew,
					component: ContentTypesCCNew,
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
					component: ContentTypesCCEdit,
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
