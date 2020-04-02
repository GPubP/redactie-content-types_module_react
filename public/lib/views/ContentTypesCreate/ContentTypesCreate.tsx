import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import Core, { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import React, { FC, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { DataLoader } from '../../components';
import { BREADCRUMB_OPTIONS, CONTENT_DETAIL_TABS } from '../../contentTypes.const';
import { generateSettingsFormState } from '../../contentTypes.helpers';
import { ContentTypesRouteProps } from '../../contentTypes.types';
import { useFieldTypes, useRoutes } from '../../hooks';
import { LoadingState } from '../../types';

const ContentTypesCreate: FC<ContentTypesRouteProps> = ({ location, routes, tenantId }) => {
	/**
	 * Hooks
	 */
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const breadcrumbRoutes = useRoutes();
	const breadcrumbs = useBreadcrumbs(breadcrumbRoutes as ModuleRouteConfig[], BREADCRUMB_OPTIONS);
	const [fieldTypesLoadingState, fieldTypes] = useFieldTypes();

	const activeTabs = useMemo(
		() =>
			CONTENT_DETAIL_TABS.map(tab => ({
				...tab,
				active: new RegExp(`${tab.target}$`).test(location.pathname),
			})),
		[location.pathname]
	);

	useEffect(() => {
		if (fieldTypesLoadingState === LoadingState.Loaded) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [fieldTypesLoadingState]);

	/**
	 * Render
	 */
	const renderChildRoutes = (): any => {
		const activeRoute =
			routes.find(item => item.path === `/${tenantId}/content-types/aanmaken`) || null;

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
				tabs={activeTabs}
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
