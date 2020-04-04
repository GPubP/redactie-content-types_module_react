import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import DataLoader from '../../components/DataLoader/DataLoader';
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
} from '../../hooks';
import { ContentTypeSchema, ContenTypeMetaSchema } from '../../services/contentTypes';
import { LoadingState, Tab } from '../../types';

const ContentTypesCreate: FC<ContentTypesRouteProps> = ({ location, routes, tenantId }) => {
	/**
	 * Hooks
	 */
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const breadcrumbs = useRoutesBreadcrumbs();
	const [contentTypeLoadingState, contentType, , createContentType] = useContentType();
	const [fieldTypesLoadingState, fieldTypes] = useFieldTypes();
	const activeTabs = useActiveTabs(CONTENT_DETAIL_TABS, location.pathname);
	const { generatePath, navigate } = useNavigate();

	useEffect(() => {
		if (contentType) {
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
						...(sectionData as ContenTypeMetaSchema),
					},
				} as ContentTypeSchema);
				break;
		}
	};

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
			contentType: contentType || generateEmptyContentType(),
			onSubmit: (sectionData: any, tab: Tab) => upsertCT(sectionData, tab),
		});
	};

	return (
		<>
			<ContextHeader
				tabs={activeTabs.slice(0, 1)}
				linkProps={(props: any) => ({
					...props,
					to: props.href,
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
