import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { AlertContainer, useTenantContext } from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { DataLoader, RenderChildRoutes } from '../../../components';
import {
	ALERT_CONTAINER_IDS,
	CONTENT_DETAIL_TABS,
	CONTENT_TYPE_DETAIL_TAB_MAP,
	MODULE_PATHS,
} from '../../../contentTypes.const';
import { ContentTypesRouteProps, LoadingState, Tab } from '../../../contentTypes.types';
import { generateEmptyContentType } from '../../../helpers';
import { useActiveTabs, useContentType, useNavigate, useRoutesBreadcrumbs } from '../../../hooks';
import { ContentTypeCreateRequest, ContentTypeMeta } from '../../../services/contentTypes';
import { contentTypesFacade } from '../../../store/contentTypes';

import { CT_SETTINGS_CREATE_ALLOWED_PATHS } from './ContentTypesCreate.const';

const ContentTypesCreate: FC<ContentTypesRouteProps> = ({ location, route }) => {
	/**
	 * Hooks
	 */
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const { generatePath, navigate } = useNavigate();
	const breadcrumbs = useRoutesBreadcrumbs([
		{
			name: 'Content types',
			target: generatePath(MODULE_PATHS.admin),
		},
	]);
	const [contentTypeLoadingState, , , contentType] = useContentType();
	const activeTabs = useActiveTabs(CONTENT_DETAIL_TABS, [], location.pathname);
	const { tenantId } = useTenantContext();
	const guardsMeta = useMemo(
		() => ({
			tenantId,
		}),
		[tenantId]
	);

	useEffect(() => {
		// Clear current active content type before creating a new one
		// Removing this line of code will trigger a redirect when there is a content type set
		contentTypesFacade.clearContentType();
	}, []);

	useEffect(() => {
		if (contentType?.uuid) {
			navigate(MODULE_PATHS.detailCC, { contentTypeUuid: contentType.uuid });
		}

		if (contentTypeLoadingState !== LoadingState.Loading) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [contentType, contentTypeLoadingState, navigate]);

	/**
	 * Methods
	 */
	const upsertCT = (sectionData: any, tab: Tab): void => {
		switch (tab.name) {
			case CONTENT_TYPE_DETAIL_TAB_MAP.settings.name:
				contentTypesFacade.createContentType({
					...generateEmptyContentType(),
					meta: {
						...(sectionData as ContentTypeMeta),
						canBeFiltered: true,
					},
				} as ContentTypeCreateRequest);
				break;
		}
	};

	/**
	 * Render
	 */
	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			allowedPaths: CT_SETTINGS_CREATE_ALLOWED_PATHS,
			contentType: contentType || generateEmptyContentType(),
			onCancel: () => navigate(MODULE_PATHS.admin),
			onSubmit: (sectionData: any, tab: Tab) => upsertCT(sectionData, tab),
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
				tabs={activeTabs.slice(0, 1)}
				linkProps={(props: any) => ({
					...props,
					to: generatePath(`${MODULE_PATHS.create}/${props.href}`),
					component: Link,
				})}
				title="Content type aanmaken"
			>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container>
				<AlertContainer
					toastClassName="u-margin-bottom"
					containerId={ALERT_CONTAINER_IDS.create}
				/>
				<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
			</Container>
		</>
	);
};

export default ContentTypesCreate;
