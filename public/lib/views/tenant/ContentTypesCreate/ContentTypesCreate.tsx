import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import {
	AlertContainer,
	ContextHeaderTabLinkProps,
	DataLoader,
	LoadingState,
	RenderChildRoutes,
	useNavigate,
	useTenantContext,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';
import {
	ALERT_CONTAINER_IDS,
	CONTENT_DETAIL_TABS,
	CONTENT_TYPE_DETAIL_TAB_MAP,
	MODULE_PATHS,
} from '../../../contentTypes.const';
import {
	ContentTypesRouteParams,
	ContentTypesRouteProps,
	CtTypes,
	Tab,
} from '../../../contentTypes.types';
import { generateEmptyContentType } from '../../../helpers';
import { useActiveTabs, useContentType, useRoutesBreadcrumbs } from '../../../hooks';
import { ContentTypeCreateRequest, ContentTypeMeta } from '../../../services/contentTypes';
import { contentTypesFacade } from '../../../store/contentTypes';

import { CT_SETTINGS_CREATE_ALLOWED_PATHS } from './ContentTypesCreate.const';

const ContentTypesCreate: FC<ContentTypesRouteProps> = ({ location, route }) => {
	/**
	 * Hooks
	 */
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const { generatePath, navigate } = useNavigate();
	const [t] = useCoreTranslation();
	const { ctType } = useParams<ContentTypesRouteParams>();
	const breadcrumbs = useRoutesBreadcrumbs([
		{
			name: 'Content types',
			target: generatePath(MODULE_PATHS.admin, { ctType }),
		},
	]);
	const { fetchingState: contentTypeLoadingState, contentType } = useContentType();
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
			navigate(MODULE_PATHS.detailCC, { contentTypeUuid: contentType.uuid, ctType });
		}

		if (contentTypeLoadingState !== LoadingState.Loading) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [contentType, contentTypeLoadingState, ctType, navigate]);

	/**
	 * Methods
	 */
	const upsertCT = (sectionData: any, tab: Tab, cb: () => void): void => {
		switch (tab.name) {
			case CONTENT_TYPE_DETAIL_TAB_MAP.settings.name:
				contentTypesFacade
					.createContentType({
						...generateEmptyContentType(),
						meta: {
							...(sectionData as ContentTypeMeta),
							canBeFiltered: ctType === CtTypes.contentTypes,
						},
					} as ContentTypeCreateRequest)
					.then(() => {
						if (cb && typeof cb === 'function') {
							cb();
						}
					});
				break;
		}
	};

	const pageTitle = `Content type ${t(CORE_TRANSLATIONS.ROUTING_CREATE)}`;

	/**
	 * Render
	 */
	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			allowedPaths: CT_SETTINGS_CREATE_ALLOWED_PATHS,
			contentType: contentType || generateEmptyContentType(),
			onCancel: () => navigate(MODULE_PATHS.root, { ctType }),
			onSubmit: (sectionData: any, tab: Tab, cb: () => void) =>
				upsertCT(sectionData, tab, cb),
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
				linkProps={(props: ContextHeaderTabLinkProps) => ({
					...props,
					to: generatePath(`${MODULE_PATHS.create}/${props.href}`, { ctType }),
					component: Link,
				})}
				title={pageTitle}
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
