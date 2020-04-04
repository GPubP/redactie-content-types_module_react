import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { DataLoader } from '../../components';
import { CONTENT_DETAIL_TABS, MODULE_PATHS } from '../../contentTypes.const';
import { generateSettingsFormState } from '../../contentTypes.helpers';
import { ContentTypesRouteProps } from '../../contentTypes.types';
import { useActiveTabs, useFieldTypes, useNavigate, useRoutesBreadcrumbs } from '../../hooks';
import { LoadingState } from '../../types';

const ContentTypesCreate: FC<ContentTypesRouteProps> = ({ location, routes, tenantId }) => {
	/**
	 * Hooks
	 */
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const breadcrumbs = useRoutesBreadcrumbs();
	const [fieldTypesLoadingState, fieldTypes] = useFieldTypes();
	const activeTabs = useActiveTabs(CONTENT_DETAIL_TABS, location.pathname);
	const { generatePath } = useNavigate();

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
			routes.find(item => item.path === generatePath(MODULE_PATHS.create)) || null;

		return Core.routes.render(activeRoute?.routes as ModuleRouteConfig[], {
			tenantId,
			fieldTypes,
			routes: activeRoute?.routes,
			contentType: generateSettingsFormState(),
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
