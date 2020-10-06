import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { AlertContainer } from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { DataLoader, RenderChildRoutes } from '../../../components';
import { ALERT_CONTAINER_IDS, MODULE_PATHS } from '../../../contentTypes.const';
import {
	ContentTypesRouteParams,
	ContentTypesRouteProps,
	LoadingState,
} from '../../../contentTypes.types';
import {
	useActiveField,
	useActiveRouteConfig,
	useActiveTabs,
	useContentType,
	useNavigate,
	useRoutesBreadcrumbs,
	useTenantContext,
} from '../../../hooks';
import useDynamicActiveField from '../../../hooks/useDynamicActiveField/useDynamicActiveField';
import { contentTypesFacade } from '../../../store/contentTypes';

import { SITE_CT_DETAIL_TABS } from './ContentTypesUpdate.const';

const ContentTypesUpdate: FC<ContentTypesRouteProps> = ({ location, route }) => {
	/**
	 * Hooks
	 */
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const activeField = useActiveField();
	const dynamicActiveField = useDynamicActiveField();
	const activeRouteConfig = useActiveRouteConfig(location, route);
	const { contentTypeUuid } = useParams<ContentTypesRouteParams>();
	const { navigate, generatePath } = useNavigate();
	const [contentTypeLoadingState, , contentType, title] = useContentType();
	const activeTabs = useActiveTabs(SITE_CT_DETAIL_TABS, [], location.pathname);
	const { siteId, tenantId } = useTenantContext();
	const breadcrumbs = useRoutesBreadcrumbs();
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);

	useEffect(() => {
		if (typeof activeRouteConfig?.title !== 'function') {
			return;
		}

		contentTypesFacade.setPageTitle(
			activeRouteConfig.title(contentType, activeField, dynamicActiveField)
		);
	}, [activeField, activeRouteConfig, contentType, dynamicActiveField]);

	useEffect(() => {
		if (contentTypeLoadingState !== LoadingState.Loading && contentType) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [contentTypeLoadingState, contentType]);

	useEffect(() => {
		if (contentTypeUuid) {
			contentTypesFacade.getContentType(contentTypeUuid);
		}
	}, [contentTypeUuid]);

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		navigate(MODULE_PATHS.site.overview, { siteId });
	};

	/**
	 * Render
	 */
	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			contentType,
			onCancel: navigateToOverview,
			onSubmit: () => null,
		};

		return (
			<RenderChildRoutes
				routes={route.routes}
				guardsMeta={guardsMeta}
				extraOptions={extraOptions}
			/>
		);
	};

	return (
		<>
			<ContextHeader
				tabs={activeTabs}
				linkProps={(props: any) => ({
					...props,
					to: generatePath(`${MODULE_PATHS.site.detail}/${props.href}`, {
						siteId,
						contentTypeUuid,
					}),
					component: Link,
				})}
				title={title}
			>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container>
				<div className="u-margin-bottom">
					<AlertContainer containerId={ALERT_CONTAINER_IDS.update} />
				</div>
				<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
			</Container>
		</>
	);
};

export default ContentTypesUpdate;
