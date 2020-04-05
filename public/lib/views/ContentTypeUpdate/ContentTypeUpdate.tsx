import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React, { FC, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { DataLoader } from '../../components';
import { CONTENT_DETAIL_TABS, MODULE_PATHS } from '../../contentTypes.const';
import { ContentTypesRouteProps } from '../../contentTypes.types';
import {
	useActiveTabs,
	useContentType,
	useFieldTypes,
	useRoutesBreadcrumbs,
	useTenantContext,
} from '../../hooks';
import { LoadingState } from '../../types';

const ContentTypesUpdate: FC<ContentTypesRouteProps> = ({ location, routes }) => {
	/**
	 * Hooks
	 */
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const { contentTypeUuid } = useParams();
	const breadcrumbs = useRoutesBreadcrumbs();
	const [fieldTypesLoadingState, fieldTypes] = useFieldTypes();
	const [contentTypeLoadingState, contentType] = useContentType(contentTypeUuid);
	const activeTabs = useActiveTabs(CONTENT_DETAIL_TABS, location.pathname);
	const { tenantId } = useTenantContext();

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
	 * Render
	 */
	const renderChildRoutes = (): any => {
		const activeRoute =
			routes.find(item => item.path === `/${tenantId}${MODULE_PATHS.detail}`) || null;

		return Core.routes.render(activeRoute?.routes as ModuleRouteConfig[], {
			tenantId,
			contentType,
			fieldTypes,
			routes: activeRoute?.routes,
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
				title="Content type bewerken"
			>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<div className="u-container u-wrapper u-margin-top">
				<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
			</div>
		</>
	);
};

export default ContentTypesUpdate;
