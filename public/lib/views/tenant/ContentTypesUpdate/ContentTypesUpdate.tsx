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
	useDetectValueChangesWorker,
	useNavigate,
	useTenantContext,
	useWillUnmount,
} from '@redactie/utils';
import { omit } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import rolesRightsConnector from '../../../connectors/rolesRights';
import { useCoreTranslation, useModuleTranslation } from '../../../connectors/translations';
import {
	ALERT_CONTAINER_IDS,
	CONTENT_DETAIL_TABS,
	CONTENT_TYPE_DETAIL_TAB_MAP,
	MODULE_PATHS,
} from '../../../contentTypes.const';
import {
	ContentTypesRouteParams,
	ContentTypesRouteProps,
	ExternalTabValue,
	Tab,
	TabTypes,
} from '../../../contentTypes.types';
import { disableTabs } from '../../../helpers';
import {
	useActiveField,
	useActiveRouteConfig,
	useActiveTabs,
	useContentType,
	useFieldTypes,
	usePresets,
	useRoutesBreadcrumbs,
} from '../../../hooks';
import useDynamicActiveField from '../../../hooks/useDynamicActiveField/useDynamicActiveField';
import { MODULE_TRANSLATIONS } from '../../../i18next/translations.const';
import {
	ContentTypeMeta,
	ContentTypeUpdateRequest,
	ModuleSettings,
} from '../../../services/contentTypes';
import { ExternalTabModel } from '../../../store/api/externalTabs';
import { useExternalTabsFacade } from '../../../store/api/externalTabs/externalTabs.facade';
import {
	ContentTypeDetailModel,
	ContentTypeFieldDetailModel,
	contentTypesFacade,
} from '../../../store/contentTypes';

const ContentTypesUpdate: FC<ContentTypesRouteProps> = ({ location, route }) => {
	/**
	 * Hooks
	 */
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const activeField = useActiveField();
	const [t] = useCoreTranslation();
	const [tModule] = useModuleTranslation();
	const dynamicActiveField = useDynamicActiveField();
	const activeRouteConfig = useActiveRouteConfig(location, route);
	const { contentTypeUuid, ctType } = useParams<ContentTypesRouteParams>();
	const { navigate, generatePath } = useNavigate();
	const [fieldTypesLoading, fieldTypes] = useFieldTypes();
	const [presetsLoading, presets] = usePresets();
	const {
		fetchingState: contentTypeLoadingState,
		contentType,
		fieldsByCompartments,
	} = useContentType();
	const [
		mySecurityRightsLoadingState,
		mySecurityrights,
	] = rolesRightsConnector.api.hooks.useMySecurityRightsForTenant(true);
	const context = useMemo(
		() => ({
			ctType,
			mySecurityrights,
			contentType,
			isActive: true,
			site: false,
		}),
		[contentType, ctType, mySecurityrights]
	);
	const [{ allVisible: externalTabs, active: activeExternalTab }] = useExternalTabsFacade(
		context,
		contentType
	);
	const activeTabs = useActiveTabs(
		CONTENT_DETAIL_TABS,
		disableTabs(externalTabs, context) as ExternalTabModel[],
		location.pathname
	);
	const { tenantId } = useTenantContext();
	const TYPE_TRANSLATIONS = MODULE_TRANSLATIONS[ctType];
	const breadcrumbs = useRoutesBreadcrumbs([
		{
			name: tModule(TYPE_TRANSLATIONS.OVERVIEW_TITLE),
			target: generatePath(MODULE_PATHS.admin, { ctType }),
		},
	]);
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);
	const [fieldsHaveChanged, resetFieldsHaveChanged] = useDetectValueChangesWorker(
		contentTypeLoadingState === LoadingState.Loaded && !!contentType?.fields,
		{
			fields: contentType?.fields,
			compartments: contentType?.compartments,
		},
		BFF_MODULE_PUBLIC_PATH
	);

	useWillUnmount(() => {
		contentTypesFacade.clearContentType();
	});

	const pageTitle =
		typeof activeRouteConfig?.title === 'function'
			? activeRouteConfig.title(contentType, activeField, dynamicActiveField, t)
			: '';

	const pageBadges: ContextHeaderBadge =
		typeof activeRouteConfig?.badges === 'function'
			? activeRouteConfig.badges(activeField, dynamicActiveField, { ctType, t: tModule })
			: [];

	useEffect(() => {
		if (
			!presetsLoading &&
			!fieldTypesLoading &&
			contentTypeLoadingState !== LoadingState.Loading &&
			mySecurityRightsLoadingState !== LoadingState.Loading &&
			contentType &&
			fieldTypes &&
			presets
		) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [
		contentTypeLoadingState,
		contentType,
		fieldTypes,
		presets,
		presetsLoading,
		fieldTypesLoading,
		mySecurityRightsLoadingState,
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
		navigate(MODULE_PATHS.admin, { ctType });
	};

	const updateCT = (
		sectionData: ContentTypeFieldDetailModel[] | ContentTypeMeta,
		tab: Tab,
		cb?: () => void
	): void => {
		const newCT = getRequestBody(sectionData, tab);

		if (!newCT) {
			return;
		}

		contentTypesFacade.updateContentType(newCT, tab.containerId).then(() => {
			if (cb && typeof cb === 'function') {
				cb();
			}
			resetFieldsHaveChanged();
		});
	};

	const removeCT = async (): Promise<void> => {
		if (!contentType) {
			return;
		}

		return contentTypesFacade.removeContentType(contentType).then(() => navigateToOverview());
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
			onDelete: removeCT,
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
				linkProps={(props: ContextHeaderTabLinkProps) => {
					const to = generatePath(`${MODULE_PATHS.detail}/${props.href}`, {
						contentTypeUuid,
						ctType,
					});
					return {
						...props,
						to,
						component: Link,
					};
				}}
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
