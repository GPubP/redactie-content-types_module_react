import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { AlertContainer } from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { DataLoader, RenderChildRoutes } from '../../components';
import {
	ALERT_CONTAINER_IDS,
	CONTENT_DETAIL_TABS,
	CONTENT_TYPE_DETAIL_TAB_MAP,
	MODULE_PATHS,
} from '../../contentTypes.const';
import { ContentTypesRouteProps, LoadingState, Tab } from '../../contentTypes.types';
import { generateEmptyContentType } from '../../helpers';
import {
	useActiveTabs,
	useContentType,
	useFieldTypes,
	useNavigate,
	useRoutesBreadcrumbs,
	useTenantContext,
} from '../../hooks';
import { ContentTypeCreateRequest, ContentTypeMeta } from '../../services/contentTypes';
import { contentTypesFacade } from '../../store/contentTypes';

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
	const [contentTypeLoadingState, , contentType] = useContentType();
	const [fieldTypesLoadingState, fieldTypes] = useFieldTypes();
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
		if (
			fieldTypesLoadingState !== LoadingState.Loading &&
			contentTypeLoadingState !== LoadingState.Loading &&
			fieldTypes
		) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [contentType, fieldTypes, contentTypeLoadingState, fieldTypesLoadingState, navigate]);

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
			fieldTypes,
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
				<div className="u-margin-bottom">
					<AlertContainer containerId={ALERT_CONTAINER_IDS.create} />
				</div>
				<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
			</Container>
		</>
	);
};

export default ContentTypesCreate;
