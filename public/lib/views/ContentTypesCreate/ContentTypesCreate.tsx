import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import React, { FC } from 'react';

import { BREADCRUMB_OPTIONS } from '../../content-types.const';
import { ContentTypesRouteProps } from '../../content-types.types';
import useRoutes from '../../hooks/useRoutes/useRoutes';
import { Tab } from '../../types';

const ContentTypesCreate: FC<ContentTypesRouteProps> = ({ basePath, routes }) => {
	const TABS: Tab[] = [
		{ name: 'Instellingen', target: `${basePath}/aanmaken/instellingen`, active: true },
		{ name: 'Content Componenten', target: `${basePath}/aanmaken/componenten` },
		{ name: 'Sites', target: `${basePath}/aanmaken/sites` },
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
		</>
	);
};

export default ContentTypesCreate;
