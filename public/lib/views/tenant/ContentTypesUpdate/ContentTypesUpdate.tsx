import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { useDetectValueChangesWorker, useTenantContext } from '@redactie/utils';
import { omit } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { DataLoader, RenderChildRoutes } from '../../../components';
import {
	CONTENT_DETAIL_TABS,
	CONTENT_TYPE_DETAIL_TAB_MAP,
	MODULE_PATHS,
	TENANT_ROOT,
} from '../../../contentTypes.const';
import {
	ContentTypesRouteParams,
	ContentTypesRouteProps,
	LoadingState,
	Tab,
	TabTypes,
} from '../../../contentTypes.types';
import {
	useActiveField,
	useActiveRouteConfig,
	useActiveTabs,
	useContentType,
	useFieldTypes,
	useNavigate,
	usePresets,
	useRoutesBreadcrumbs,
} from '../../../hooks';
import useDynamicActiveField from '../../../hooks/useDynamicActiveField/useDynamicActiveField';
import {
	ContentTypeMeta,
	ContentTypeUpdateRequest,
	ModuleSettings,
} from '../../../services/contentTypes';
import { useExternalTabsFacade } from '../../../store/api/externalTabs/externalTabs.facade';
import {
	ContentTypeDetailModel,
	ContentTypeFieldDetailModel,
	contentTypesFacade,
} from '../../../store/contentTypes';
import { ExternalTabValue } from '../ContentTypesDetailExternal';

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
	const [fieldTypesLoadingState, fieldTypes] = useFieldTypes();
	const [presetsLoadingState, presets] = usePresets();
	const [
		contentTypeLoadingState,
		,
		,
		contentType,
		title,
		fieldsByCompartments,
	] = useContentType();
	const [{ all: externalTabs, active: activeExternalTab }] = useExternalTabsFacade();
	const activeTabs = useActiveTabs(CONTENT_DETAIL_TABS, externalTabs, location.pathname);
	const { tenantId } = useTenantContext();
	const showParagraphBreadcrumb = /\/(dynamisch)\//.test(location.pathname);
	const excludePaths = showParagraphBreadcrumb
		? []
		: [`${TENANT_ROOT}${MODULE_PATHS.detailCCEdit}`];
	const breadcrumbs = useRoutesBreadcrumbs(
		[
			{
				name: 'Content types',
				target: generatePath(MODULE_PATHS.admin),
			},
		],
		excludePaths
	);
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);
	const [fieldsHaveChanged, resetFieldsHaveChanged] = useDetectValueChangesWorker(
		contentTypeLoadingState === LoadingState.Loaded,
		contentType?.fields,
		BFF_MODULE_PUBLIC_PATH
	);

	useEffect(() => {
		if (typeof activeRouteConfig?.title !== 'function') {
			return;
		}

		// TODO: figure out why this is needed (last set of title does not update component)
		setTimeout(() =>
			contentTypesFacade.setPageTitle(
				activeRouteConfig.title(contentType, activeField, dynamicActiveField)
			)
		);
	}, [activeField, activeRouteConfig, contentType, dynamicActiveField]);

	useEffect(() => {
		if (
			presetsLoadingState !== LoadingState.Loading &&
			fieldTypesLoadingState !== LoadingState.Loading &&
			contentTypeLoadingState !== LoadingState.Loading &&
			contentType &&
			fieldTypes &&
			presets
		) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [
		presetsLoadingState,
		contentTypeLoadingState,
		fieldTypesLoadingState,
		contentType,
		fieldTypes,
		presets,
	]);

	useEffect(() => {
		if (contentType && contentTypeUuid !== contentType.uuid) {
			contentTypesFacade.clearContentType();
		}

		if (contentTypeUuid && contentType?.uuid !== contentTypeUuid) {
			contentTypesFacade.getContentType(contentTypeUuid);
		}
	}, [contentType, contentTypeUuid]);

	/**
	 * Methods
	 */
	const upsertExternalToBody = (
		ct: ContentTypeDetailModel,
		sectionData: ExternalTabValue,
		tab: Tab
	): ContentTypeDetailModel => {
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
		sectionData: ContentTypeFieldDetailModel[] | ContentTypeMeta | ExternalTabValue,
		tab: Tab
	): ContentTypeUpdateRequest | null => {
		let body = null;

		if (!contentType) {
			return null;
		}

		if (tab.type === TabTypes.EXTERNAL) {
			body = upsertExternalToBody(contentType, sectionData as ExternalTabValue, tab);
		} else {
			switch (tab.name) {
				case CONTENT_TYPE_DETAIL_TAB_MAP.settings.name:
					body = {
						...contentType,
						meta: {
							...contentType?.meta,
							...(sectionData as ContentTypeMeta),
						},
					};
					break;
				case CONTENT_TYPE_DETAIL_TAB_MAP.contentComponents.name:
					body = {
						...contentType,
						fields: sectionData as ContentTypeFieldDetailModel[],
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
		sectionData: ContentTypeFieldDetailModel[] | ContentTypeMeta,
		tab: Tab
	): void => {
		const newCT = getRequestBody(sectionData, tab);

		if (!newCT) {
			return;
		}

		contentTypesFacade.updateContentType(newCT, tab.containerId);
		resetFieldsHaveChanged();
	};

	const showTabs = !/\/(aanmaken|bewerken)\//.test(location.pathname);

	/**
	 * Render
	 */
	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			presets,
			fieldTypes,
			contentType,
			fieldsByCompartments,
			onCancel: navigateToOverview,
			onSubmit: updateCT,
			fieldsHaveChanged,
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
				tabs={showTabs ? activeTabs : undefined}
				linkProps={(props: any) => {
					const to = generatePath(`${MODULE_PATHS.detail}/${props.href}`, {
						contentTypeUuid,
					});
					return {
						...props,
						to,
						component: Link,
					};
				}}
				title={title}
			>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
			</Container>
		</>
	);
};

export default ContentTypesUpdate;
