import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import { omit } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { DataLoader, RenderChildRoutes } from '../../components';
import {
	CONTENT_DETAIL_TABS,
	CONTENT_TYPE_DETAIL_TAB_MAP,
	MODULE_PATHS,
} from '../../contentTypes.const';
import { ContentTypesRouteProps } from '../../contentTypes.types';
import {
	useActiveField,
	useActiveTabs,
	useContentType,
	useFieldTypes,
	useNavigate,
	useRoutesBreadcrumbs,
	useTenantContext,
} from '../../hooks';
import {
	ContentTypeFieldSchema,
	ContentTypeMetaSchema,
	ContentTypeSchema,
	ContentTypeUpdateRequest,
	ModuleSettings,
} from '../../services/contentTypes';
import { useExternalTabstFacade } from '../../store/api/externalTabs/externalTabs.facade';
import { contentTypesFacade } from '../../store/contentTypes';
import { LoadingState, Tab, TabTypes } from '../../types';
import { ExternalTabValue } from '../ContentTypeDetailExternal/ContentTypeDetailExternal.types';

const ContentTypesUpdate: FC<ContentTypesRouteProps> = ({ location, routes }) => {
	/**
	 * Hooks
	 */
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const activeField = useActiveField();
	const { contentTypeUuid } = useParams();
	const { navigate, generatePath } = useNavigate();
	const [fieldTypesLoadingState, fieldTypes] = useFieldTypes();
	const [contentTypeLoadingState, contentType] = useContentType();
	const [{ all: externalTabs, active: activeExternalTab }] = useExternalTabstFacade();
	const activeTabs = useActiveTabs(CONTENT_DETAIL_TABS, externalTabs, location.pathname);
	const { tenantId } = useTenantContext();
	const breadcrumbs = useRoutesBreadcrumbs(
		[
			{
				name: 'Content types',
				target: generatePath(MODULE_PATHS.admin),
			},
		],
		{
			contentTypeName: contentType?.meta.label,
		}
	);
	const guardsMeta = useMemo(
		() => ({
			tenantId,
		}),
		[tenantId]
	);

	useEffect(() => {
		if (
			fieldTypesLoadingState !== LoadingState.Loading &&
			contentTypeLoadingState !== LoadingState.Loading
		) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [contentTypeLoadingState, fieldTypesLoadingState]);

	useEffect(() => {
		if (contentTypeUuid) {
			contentTypesFacade.getContentType(contentTypeUuid);
		}
	}, [contentTypeUuid]);

	/**
	 * Methods
	 */
	const upsertExternalToBody = (
		ct: ContentTypeSchema,
		sectionData: ExternalTabValue,
		tab: Tab
	): ContentTypeSchema => {
		const oldModulesConfig = ct?.modulesConfig || [];
		const moduleConfigIndex = (oldModulesConfig || []).findIndex(c => c.name === tab.id);
		const moduleConfig: ModuleSettings = oldModulesConfig[moduleConfigIndex] || {
			name: tab.id,
			label: activeExternalTab?.label,
		};
		moduleConfig.config = sectionData.config;
		moduleConfig.validationSchema = sectionData.validationSchema;

		const newModulesConfig = [...oldModulesConfig];

		if (moduleConfigIndex >= 0) {
			newModulesConfig[moduleConfigIndex] = moduleConfig;
		} else {
			newModulesConfig.push(moduleConfig);
		}

		return {
			...ct,
			modulesConfig: newModulesConfig,
		};
	};
	const getRequestBody = (
		sectionData: ContentTypeFieldSchema[] | ContentTypeMetaSchema | ExternalTabValue,
		tab: Tab
	): ContentTypeUpdateRequest | null => {
		let body = null;

		if (tab.type === TabTypes.EXTERNAL) {
			body = upsertExternalToBody(contentType as any, sectionData as ExternalTabValue, tab);
		} else {
			switch (tab.name) {
				case CONTENT_TYPE_DETAIL_TAB_MAP.settings.name:
					body = {
						...contentType,
						meta: {
							...contentType?.meta,
							...(sectionData as ContentTypeMetaSchema),
						},
					};
					break;
				case CONTENT_TYPE_DETAIL_TAB_MAP.contentComponents.name:
					body = {
						...contentType,
						fields: sectionData as ContentTypeFieldSchema[],
					};
					break;
				case CONTENT_TYPE_DETAIL_TAB_MAP.sites.name:
					// TODO: move sites update here
					return null;
				default:
					return null;
			}
		}

		// Remove properties
		return omit(['errorMessages', 'validateSchema'], body) as ContentTypeUpdateRequest;
	};

	const navigateToOverview = (): void => {
		navigate(MODULE_PATHS.root);
	};

	const updateCT = (
		sectionData: ContentTypeFieldSchema[] | ContentTypeMetaSchema,
		tab: Tab
	): void => {
		const newCT = getRequestBody(sectionData, tab);

		if (!newCT) {
			return;
		}

		contentTypesFacade.updateContentType(newCT);
	};

	const showTabs = !/\/(nieuw|bewerken)\//.test(location.pathname);

	/**
	 * Render
	 */
	const renderChildRoutes = (): ReactElement | null => {
		if (!contentType) {
			return null;
		}

		const activeRoute =
			routes.find(item => item.path === `/${tenantId}${MODULE_PATHS.detail}`) || null;

		const extraOptions = {
			fieldTypes,
			contentType,
			onCancel: navigateToOverview,
			onSubmit: updateCT,
			routes: activeRoute?.routes,
			state: { activeField, fields: contentType.fields },
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
				tabs={showTabs ? activeTabs : undefined}
				linkProps={(props: any) => ({
					...props,
					to: props.href,
					component: Link,
				})}
				title="Content type bewerken"
			>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
		</>
	);
};

export default ContentTypesUpdate;
