import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import { omit } from 'ramda';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
	useNavigate,
	useRoutesBreadcrumbs,
	useTenantContext,
} from '../../hooks';
import {
	ContentTypeFieldSchema,
	ContentTypeMetaSchema,
	ContentTypeSchema,
} from '../../services/contentTypes';
import { ContentTypeField, internalQuery, internalService } from '../../store/internal';
import { LoadingState, Tab } from '../../types';

const ContentTypesUpdate: FC<ContentTypesRouteProps> = ({ location, routes }) => {
	/**
	 * Hooks
	 */
	const [activeField, setActiveField] = useState<ContentTypeField | null>(null);
	const [fields, setFields] = useState<ContentTypeField[]>([]);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const { contentTypeUuid } = useParams();
	const breadcrumbs = useRoutesBreadcrumbs();
	const [fieldTypesLoadingState, fieldTypes] = useFieldTypes();
	const [contentTypeLoadingState, contentType, updateContentType] = useContentType(
		contentTypeUuid
	);
	const activeTabs = useActiveTabs(CONTENT_DETAIL_TABS, location.pathname);
	const { navigate } = useNavigate();
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

	useEffect(() => {
		if (contentTypeLoadingState !== LoadingState.Loading && contentType?.fields.length) {
			internalService.updateFields(
				contentType.fields.map(f => ({ ...f, dataType: f.dataType._id }))
			);
		}
	}, [contentType, contentTypeLoadingState]);

	useEffect(() => {
		const destroyed$: Subject<boolean> = new Subject<boolean>();

		internalQuery.activeField$.pipe(takeUntil(destroyed$)).subscribe(activeFieldSub => {
			if (activeFieldSub) {
				return setActiveField(activeFieldSub);
			}
		});
		internalQuery.fields$.pipe(takeUntil(destroyed$)).subscribe(fieldsSub => {
			if (fieldsSub) {
				return setFields(fieldsSub);
			}
		});

		return () => {
			destroyed$.next(true);
			destroyed$.complete();
		};
	}, []);

	/**
	 * Methods
	 */
	const getRequestBody = (
		sectionData: ContentTypeFieldSchema[] | ContentTypeMetaSchema,
		tab: Tab
	): ContentTypeSchema | null => {
		let body = null;
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
		// Remove properties
		return omit(['errorMessages', 'validateSchema'], body) as ContentTypeSchema;
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

		// TODO: fix with store integration
		updateContentType(newCT);
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

		return Core.routes.render(activeRoute?.routes as ModuleRouteConfig[], {
			fieldTypes,
			contentType,
			onCancel: navigateToOverview,
			onSubmit: updateCT,
			routes: activeRoute?.routes,
			state: { activeField, fields },
		});
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
