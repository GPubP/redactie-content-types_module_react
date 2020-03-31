import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import Core, { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import DataLoader from '../../components/DataLoader/DataLoader';
import { BREADCRUMB_OPTIONS } from '../../content-types.const';
import { generateSettingsFormState } from '../../content-types.helpers';
import { ContentTypesRouteProps } from '../../content-types.types';
import useRoutes from '../../hooks/useRoutes/useRoutes';
import { LoadingState, Tab } from '../../types';

const TABS: Tab[] = [
	{
		name: 'Instellingen',
		target: 'instellingen',
		active: true,
	},
	{
		name: 'Content Componenten',
		target: 'componenten',
		active: false,
	},
	{
		name: 'Sites',
		target: 'sites',
		active: false,
	},
];

const ContentTypesCreate: FC<ContentTypesRouteProps> = ({ basePath, routes }) => {
	/**
	 * Hooks
	 */
	const breadcrumbRoutes = useRoutes();
	const breadcrumbs = useBreadcrumbs(breadcrumbRoutes as ModuleRouteConfig[], BREADCRUMB_OPTIONS);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);

	useEffect(() => {
		setInitialLoading(LoadingState.Loaded);
	}, []);

	/**
	 * Methods
	 */
	const activeRoute = routes.find(item => item.path === `${basePath}/aanmaken`) || null;

	/**
	 * Render
	 */
	const renderChildRoutes = (): any => {
		return Core.routes.render(activeRoute?.routes as ModuleRouteConfig[], {
			basePath: basePath,
			routes: activeRoute?.routes,
			contentType: generateSettingsFormState(),
			fieldTypes: null,
		});
	};
	return (
		<>
			<ContextHeader
				tabs={TABS}
				linkProps={(props: any) => ({
					...props,
					to: props.href,
					component: Link,
				})}
				title="Content type aanmaken"
			>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<div className="u-container u-wrapper u-margin-top">
				<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
			</div>
		</>
	);
};

export default ContentTypesCreate;
