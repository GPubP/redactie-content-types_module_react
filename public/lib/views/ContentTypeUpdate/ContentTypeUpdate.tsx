import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import Core, { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import React, { FC, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { DataLoader } from '../../components';
import { BREADCRUMB_OPTIONS, CONTENT_DETAIL_TABS } from '../../contentTypes.const';
import { ContentTypesRouteProps } from '../../contentTypes.types';
import { useContentType, useFieldTypes, useRoutes } from '../../hooks';
import { LoadingState } from '../../types';

const ContentTypesUpdate: FC<ContentTypesRouteProps> = ({ routes, tenantId }) => {
	/**
	 * Hooks
	 */
	const { contentTypeUuid } = useParams();
	const breadcrumbRoutes = useRoutes();
	const breadcrumbs = useBreadcrumbs(breadcrumbRoutes as ModuleRouteConfig[], BREADCRUMB_OPTIONS);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [fieldTypesLoadingState, fieldTypes] = useFieldTypes();
	const [contentTypeLoadingState, contentType] = useContentType(contentTypeUuid);

	useEffect(() => {
		if (
			fieldTypesLoadingState === LoadingState.Loaded &&
			contentTypeLoadingState === LoadingState.Loaded
		) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [contentTypeLoadingState, fieldTypesLoadingState]);

	/**
	 * Methods
	 */
	const activeRoute =
		routes.find(item => item.path === `/${tenantId}/content-types/:contentTypeUuid`) || null;

	/**
	 * Render
	 */
	const renderChildRoutes = (): any => {
		return Core.routes.render(activeRoute?.routes as ModuleRouteConfig[], {
			tenantId: tenantId,
			routes: activeRoute?.routes,
			contentType,
			fieldTypes,
			onSubmit: () => console.log('temp onSubmit in contentTypesCreate'),
		});
	};

	return (
		<>
			<ContextHeader
				tabs={CONTENT_DETAIL_TABS}
				linkProps={(props: any) => ({
					...props,
					to: props.href,
					component: Link,
				})}
				title="Content type aanmaken"
			>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
		</>
	);
};

export default ContentTypesUpdate;
