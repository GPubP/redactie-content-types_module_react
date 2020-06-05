import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { DataLoader, RenderChildRoutes } from '../../components';
import {
	CONTENT_DETAIL_TABS,
	CONTENT_TYPE_DETAIL_TAB_MAP,
	MODULE_PATHS,
} from '../../contentTypes.const';
import { generateEmptyContentType } from '../../contentTypes.helpers';
import { ContentTypesRouteProps } from '../../contentTypes.types';
import {
	useActiveTabs,
	useContentType,
	useFieldTypes,
	useNavigate,
	useRoutesBreadcrumbs,
	useTenantContext,
} from '../../hooks';
import { ContentTypeMetaSchema, ContentTypeSchema } from '../../services/contentTypes';
import { LoadingState, Tab } from '../../types';

const ContentTypesCreate: FC<ContentTypesRouteProps> = ({ location, routes }) => {
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
	const [contentTypeLoadingState, contentType, , createContentType] = useContentType();
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
		if (contentType?.uuid) {
			navigate(MODULE_PATHS.detailCC, { contentTypeUuid: contentType.uuid });
		}
		if (
			fieldTypesLoadingState !== LoadingState.Loading &&
			contentTypeLoadingState !== LoadingState.Loading
		) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [contentType, contentTypeLoadingState, fieldTypesLoadingState, navigate]);

	/**
	 * Methods
	 */
	const upsertCT = (sectionData: any, tab: Tab): void => {
		switch (tab.name) {
			case CONTENT_TYPE_DETAIL_TAB_MAP.settings.name:
				createContentType({
					...generateEmptyContentType(),
					meta: {
						...(sectionData as ContentTypeMetaSchema),
					},
				} as ContentTypeSchema);
				break;
		}
	};

	/**
	 * Methods
	 */
	//  Don't show tabs on new CC page
	const showTabs = !/\/nieuw\//.test(location.pathname);

	/**
	 * Render
	 */
	const renderChildRoutes = (): any => {
		const activeRoute =
			routes.find(item => item.path === generatePath(MODULE_PATHS.create)) || null;

		const extraOptions = {
			fieldTypes,
			routes: activeRoute?.routes,
			contentType: contentType || generateEmptyContentType(),
			onCancel: () => navigate(MODULE_PATHS.admin),
			onSubmit: (sectionData: any, tab: Tab) => upsertCT(sectionData, tab),
		};

		return (
			<RenderChildRoutes
				routes={activeRoute?.routes}
				guardsMeta={guardsMeta}
				extraOptions={extraOptions}
			/>
		);
	};

	return (
		<>
			<ContextHeader
				tabs={showTabs ? activeTabs.slice(0, 1) : undefined}
				linkProps={(props: any) => ({
					...props,
					to: generatePath(`${MODULE_PATHS.create}/${props.href}`),
					component: Link,
				})}
				title="Content type aanmaken"
			>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<div className="u-margin-top">
				<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
			</div>
		</>
	);
};

export default ContentTypesCreate;
