import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import {
	AlertContainer,
	DataLoader,
	RenderChildRoutes,
	useSiteContext,
	useTenantContext,
} from '@redactie/utils';
import React, { FC, MouseEvent, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { ALERT_CONTAINER_IDS, MODULE_PATHS } from '../../../contentTypes.const';
import {
	ContentTypesRouteParams,
	ContentTypesRouteProps,
	LoadingState,
} from '../../../contentTypes.types';
import { disableTabs } from '../../../helpers/tabs';
import {
	useActiveField,
	useActiveRouteConfig,
	useActiveTabs,
	useContentType,
	useNavigate,
	useRoutesBreadcrumbs,
} from '../../../hooks';
import useDynamicActiveField from '../../../hooks/useDynamicActiveField/useDynamicActiveField';
import { ExternalTabModel, useExternalTabsFacade } from '../../../store/api/externalTabs';
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
	const [contentTypeLoadingState, , , contentType, title] = useContentType();
	const [{ all: externalTabs }] = useExternalTabsFacade();
	const activeTabs = useActiveTabs(
		SITE_CT_DETAIL_TABS,
		disableTabs(externalTabs) as ExternalTabModel[],
		location.pathname
	);
	const { tenantId } = useTenantContext();
	const { siteId } = useSiteContext();
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
		navigate(`/sites${MODULE_PATHS.site.overview}`, { siteId });
	};

	/**
	 * Render
	 */
	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			contentType,
			onCancel: navigateToOverview,
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
					onClick: (e: MouseEvent) => {
						const tab = activeTabs.find(tab => tab.target === props.href);
						if (tab?.disabled) {
							e.preventDefault();
						}
					},
					to: generatePath(`/sites${MODULE_PATHS.site.detail}/${props.href}`, {
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
				<AlertContainer
					toastClassName="u-margin-bottom"
					containerId={ALERT_CONTAINER_IDS.update}
				/>
				<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
			</Container>
		</>
	);
};

export default ContentTypesUpdate;
