import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import Core, { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import DataLoader from '../../components/DataLoader/DataLoader';
import { generateSettingsFormState } from '../../content-types.helpers';
import { BREADCRUMB_OPTIONS } from '../../contentTypes.const';
import { ContentTypesRouteProps } from '../../contentTypes.types';
import useFieldTypes from '../../hooks/useFieldTypes/useFieldTypes';
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
		target: 'content-componenten',
		active: false,
	},
	{
		name: 'Sites',
		target: 'sites',
		active: false,
	},
];

const ContentTypesCreate: FC<ContentTypesRouteProps> = ({ routes, tenantId }) => {
	/**
	 * Hooks
	 */
	const breadcrumbRoutes = useRoutes();
	const breadcrumbs = useBreadcrumbs(breadcrumbRoutes as ModuleRouteConfig[], BREADCRUMB_OPTIONS);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [fieldTypesLoadingState, fieldTypes] = useFieldTypes();

	useEffect(() => {
		if (fieldTypesLoadingState === LoadingState.Loaded) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [fieldTypesLoadingState]);

	/**
	 * Methods
	 */
	const activeRoute =
		routes.find(item => item.path === `/${tenantId}/content-types/aanmaken`) || null;

	/**
	 * Render
	 */
	const renderChildRoutes = (): any => {
		return Core.routes.render(activeRoute?.routes as ModuleRouteConfig[], {
			tenantId: tenantId,
			routes: activeRoute?.routes,
			contentType: generateSettingsFormState(),
			fieldTypes,
			onSubmit: () => console.log('temp onSubmit in contentTypesCreate'),
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
