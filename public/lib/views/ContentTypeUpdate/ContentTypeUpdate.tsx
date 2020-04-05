import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React, { FC, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
	ContentTypeFieldSchema,
	ContenTypeMetaSchema,
} from '../../../../dist/lib/content-types.types.d';
import DataLoader from '../../components/DataLoader/DataLoader';
import {
	CONTENT_DETAIL_TABS,
	CONTENT_TYPE_DETAIL_TAB_MAP,
	MODULE_PATHS,
} from '../../contentTypes.const';
import { ContentTypesRouteProps } from '../../contentTypes.types';
import {
	useActiveTabs,
	useContentType,
	useFieldTypes,
	useRoutesBreadcrumbs,
	useTenantContext,
} from '../../hooks';
import { ContentTypeSchema } from '../../services/contentTypes';
import { LoadingState, Tab } from '../../types';

const ContentTypesUpdate: FC<ContentTypesRouteProps> = ({ location, routes }) => {
	/**
	 * Hooks
	 */
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const { contentTypeUuid } = useParams();
	const breadcrumbs = useRoutesBreadcrumbs();
	const [fieldTypesLoadingState, fieldTypes] = useFieldTypes();
	const [contentTypeLoadingState, contentType, updateContentType] = useContentType(
		contentTypeUuid
	);
	const activeTabs = useActiveTabs(CONTENT_DETAIL_TABS, location.pathname);
	const { tenantId } = useTenantContext();

	useEffect(() => {
		if (
			fieldTypesLoadingState !== LoadingState.Loading &&
			contentTypeLoadingState !== LoadingState.Loading
		) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [contentTypeLoadingState, fieldTypesLoadingState]);

	/**
	 * Methods
	 */
	const getRequestBody = (
		sectionData: ContentTypeFieldSchema[] | ContenTypeMetaSchema,
		tab: Tab
	): ContentTypeSchema | null => {
		switch (tab.name) {
			case CONTENT_TYPE_DETAIL_TAB_MAP.settings.name:
				return {
					...contentType,
					meta: {
						...contentType?.meta,
						...(sectionData as ContenTypeMetaSchema),
					},
				} as ContentTypeSchema;
			case CONTENT_TYPE_DETAIL_TAB_MAP.contentComponenten.name:
				return {
					...contentType,
					fields: sectionData as ContentTypeFieldSchema[],
				} as ContentTypeSchema;
			case CONTENT_TYPE_DETAIL_TAB_MAP.sites.name:
				// TODO: move sites update here
				return null;
			default:
				return null;
		}
	};

	const updateCT = (
		sectionData: ContentTypeFieldSchema[] | ContenTypeMetaSchema,
		tab: Tab
	): void => {
		const newCT = getRequestBody(sectionData, tab);

		if (!newCT) {
			return;
		}

		// TODO: fix with store integration
		updateContentType(newCT);
	};

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
			onSubmit: (sectionData: ContentTypeFieldSchema[] | ContenTypeMetaSchema, tab: Tab) =>
				updateCT(sectionData, tab),
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
			<div className="u-margin-top">
				<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
			</div>
		</>
	);
};

export default ContentTypesUpdate;
