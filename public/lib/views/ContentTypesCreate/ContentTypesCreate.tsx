import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import Core, { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { BREADCRUMB_OPTIONS } from '../../content-types.const';
import { ContentTypesRouteProps } from '../../content-types.types';
import useRoutes from '../../hooks/useRoutes/useRoutes';
import { Tab } from '../../types';

const ContentTypesCreate: FC<ContentTypesRouteProps> = ({ basePath, routes }) => {
	const route = routes.find(item => item.path === `${basePath}/aanmaken`) || null;
	const TABS: Tab[] = [
		{
			name: 'Instellingen',
			target: `${route?.path}/instellingen`,
			active: true,
		},
		{
			name: 'Content Componenten',
			target: `${route?.path}/componenten`,
		},
		{ name: 'Sites', target: `${route?.path}/sites` },
	];

	/**
	 * Hooks
	 */
	const activeRoute = useRoutes();
	const breadcrumbs = useBreadcrumbs(activeRoute as ModuleRouteConfig[], BREADCRUMB_OPTIONS);

	/**
	 * Render
	 */
	return (
		<>
			<ContextHeader
				tabs={TABS}
				linkProps={(props: any) => ({ ...props, to: props.href, component: Link })}
				title="Content type aanmaken"
			>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			{Core.routes.render(route?.routes as ModuleRouteConfig[], {
				basePath: basePath,
				routes: route?.routes,
			})}
		</>
	);
};

export default ContentTypesCreate;
