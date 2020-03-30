import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import Core, { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import React, { FC } from 'react';

import { BREADCRUMB_OPTIONS } from '../../content-types.const';
import { ContentTypesRouteProps } from '../../content-types.types';
import useRoutes from '../../hooks/useRoutes/useRoutes';
import { Tab } from '../../types';

const ContentTypesCreate: FC<ContentTypesRouteProps> = ({ basePath, routes }) => {
	const route = routes.find(item => item.path === `${basePath}/aanmaken`) || null;
	const TABS: Tab[] = [
		{ name: 'Instellingen', target: `${route?.path}/instellingen`, active: true },
		{ name: 'Content Componenten', target: `${route?.path}/componenten` },
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
			<ContextHeader tabs={TABS} title="Content type aanmaken">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<div className="u-container u-wrapper u-margin-top">
				{Core.routes.render(route?.routes as ModuleRouteConfig[], {
					basePath: basePath,
					routes: route?.routes,
				})}
			</div>
		</>
	);
};

export default ContentTypesCreate;
