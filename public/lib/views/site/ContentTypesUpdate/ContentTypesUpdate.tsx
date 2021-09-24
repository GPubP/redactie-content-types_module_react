import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import {
	AlertContainer,
	ContextHeaderBadge,
	ContextHeaderTabLinkProps,
	DataLoader,
	LoadingState,
	RenderChildRoutes,
	useNavigate,
	useSiteContext,
	useTenantContext,
} from '@redactie/utils';
import React, { FC, MouseEvent, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import rolesRightsConnector from '../../../connectors/rolesRights';
import { useCoreTranslation } from '../../../connectors/translations';
import { ALERT_CONTAINER_IDS, MODULE_PATHS } from '../../../contentTypes.const';
import {
	ContentTypesRouteParams,
	ContentTypesRouteProps,
	ExternalTabValue,
	Tab,
} from '../../../contentTypes.types';
import { disableTabs } from '../../../helpers/tabs';
import {
	useActiveField,
	useActiveRouteConfig,
	useActiveTabs,
	useContentType,
	useRoutesBreadcrumbs,
} from '../../../hooks';
import useDynamicActiveField from '../../../hooks/useDynamicActiveField/useDynamicActiveField';
import { ContentTypeWorkflowUpdateRequest } from '../../../services/contentTypes';
import { ExternalTabModel, useExternalTabsFacade } from '../../../store/api/externalTabs';
import { contentTypesFacade } from '../../../store/contentTypes';

import { SITE_CT_DETAIL_TABS } from './ContentTypesUpdate.const';

const ContentTypesUpdate: FC<ContentTypesRouteProps> = ({ location, route }) => {
	/**
	 * Hooks
	 */
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [t] = useCoreTranslation();
	const activeField = useActiveField();
	const dynamicActiveField = useDynamicActiveField();
	const activeRouteConfig = useActiveRouteConfig(location, route);
	const { contentTypeUuid } = useParams<ContentTypesRouteParams>();
	const { navigate, generatePath } = useNavigate();
	const [contentTypeLoadingState, contentTypeUpdatingState, , contentType] = useContentType();
	const [{ all: externalTabs }] = useExternalTabsFacade();
	const { siteId } = useSiteContext();
	const activeTabs = useActiveTabs(
		SITE_CT_DETAIL_TABS,
		disableTabs(externalTabs, {}) as ExternalTabModel[],
		location.pathname
	);
	const { tenantId } = useTenantContext();
	const breadcrumbs = useRoutesBreadcrumbs(
		[
			{
				name: 'Content types',
				target: generatePath(`/sites${MODULE_PATHS.site.overview}`, { siteId }),
			},
		],
		undefined,
		true
	);
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);
	const [
		mySecurityRightsLoadingState,
		mySecurityrights,
	] = rolesRightsConnector.api.hooks.useMySecurityRightsForSite({
		siteUuid: siteId,
		onlyKeys: true,
	});
	const canUpdate = useMemo(
		() =>
			rolesRightsConnector.api.helpers.checkSecurityRights(
				mySecurityrights,
				[rolesRightsConnector.securityRights.update],
				false
			),
		[mySecurityrights]
	);

	useEffect(() => {
		if (
			contentTypeLoadingState !== LoadingState.Loading &&
			mySecurityRightsLoadingState !== LoadingState.Loading &&
			contentType
		) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [contentTypeLoadingState, contentType, mySecurityRightsLoadingState]);

	useEffect(() => {
		if (contentTypeUuid) {
			contentTypesFacade.getSiteContentType(siteId, contentTypeUuid);
		}
	}, [contentTypeUuid, siteId]);

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		navigate(`/sites${MODULE_PATHS.site.overview}`, { siteId });
	};

	const onSubmit = async (data: ExternalTabValue, tab: Tab): Promise<void> => {
		if (!contentType) {
			return;
		}

		if (tab.id === 'workflow') {
			await contentTypesFacade.updateContentTypeSiteWorkflow(
				data.config as ContentTypeWorkflowUpdateRequest,
				contentType,
				siteId,
				ALERT_CONTAINER_IDS.update
			);
		}
	};

	const pageTitle =
		typeof activeRouteConfig?.title === 'function'
			? activeRouteConfig.title(
					contentTypeLoadingState !== LoadingState.Loading ? contentType : null,
					activeField,
					dynamicActiveField,
					t
			  )
			: '';

	const pageBadges: ContextHeaderBadge =
		typeof activeRouteConfig?.badges === 'function'
			? activeRouteConfig.badges(activeField, dynamicActiveField)
			: [];

	/**
	 * Render
	 */
	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			contentType,
			onSubmit,
			onCancel: navigateToOverview,
			isLoading:
				contentTypeLoadingState !== LoadingState.Loaded ||
				contentTypeUpdatingState !== LoadingState.Loaded,
			canUpdate,
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
				linkProps={(props: ContextHeaderTabLinkProps) => ({
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
				title={pageTitle}
				badges={pageBadges}
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
