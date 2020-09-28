import React, { ReactElement, useEffect, useState } from 'react';
import { Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	PaginatedTable
} from '@acpaas-ui/react-editorial-components';
import { DataLoader } from '../../../components';
import { useContentTypes, useNavigate, useRoutesBreadcrumbs, useSite, useTenantContext } from '../../../hooks';
import { MODULE_PATHS } from '../../../contentTypes.const';
import { LoadingState } from '../../../contentTypes.types';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { useCoreTranslation } from '../../../connectors/translations';
import { DEFAULT_CONTENT_TYPES_SEARCH_PARAMS } from '../../../services/contentTypes/contentTypes.service.cont';
import { OrderBy } from '../../tenant';
import rolesRightsConnector from '../../../connectors/rolesRights';
import { ContentTypeModel, contentTypesFacade } from '../../../store/contentTypes';
import { CONTENT_TYPE_OVERVIEW_COLUMNS } from './ContentTypesOverview.const';
import { sitesFacade } from '../../../store/sites';
import { ContentTypesPerSiteOverviewTableRow } from './ContentTypesOverview.types';

const ContentTypesOverview: React.FC = () => {
	/**
	 * Hooks
	 */
	const breadcrumbs = useRoutesBreadcrumbs();
	const { navigate } = useNavigate();
	const [t] = useCoreTranslation();
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [loadingContentTypes, contentTypes, meta] = useContentTypes();
	const [loadingSite, site] = useSite();
	const [
		mySecurityRightsLoadingState,
		mySecurityrights,
	] = rolesRightsConnector.api.hooks.useMySecurityRightsForTenant(true);
	const [contentTypesSearchParams, setContentTypesSearchParams] = useState(
		DEFAULT_CONTENT_TYPES_SEARCH_PARAMS
	);
	const [activeSorting, setActiveSorting] = useState<OrderBy>();
	const {siteId} = useTenantContext();

	useEffect(() => {
		console.log(loadingContentTypes, loadingSite, mySecurityRightsLoadingState, contentTypes, site, mySecurityrights, meta);
		if (
			loadingContentTypes !== LoadingState.Loading &&
			loadingSite !== LoadingState.Loading &&
			mySecurityRightsLoadingState !== LoadingState.Loading &&
			contentTypes &&
			site &&
			mySecurityrights &&
			meta
		) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [
		loadingContentTypes,
		loadingSite,
		meta,
		contentTypes,
		site,
		mySecurityrights,
		mySecurityRightsLoadingState,
	]);

	useEffect(() => {
		contentTypesFacade.getContentTypes(contentTypesSearchParams);
	}, [contentTypesSearchParams]);

	useEffect(() => {
		if (!siteId) {
			return;
		}
		sitesFacade.getSite(siteId);
	}, [contentTypesSearchParams]);

	/**
	 * Functions
	 */

	const handlePageChange = (page: number): void => {
		setContentTypesSearchParams({
			...contentTypesSearchParams,
			skip: (page - 1) * DEFAULT_CONTENT_TYPES_SEARCH_PARAMS.limit,
		});
	};

	const handleOrderBy = (orderBy: { key: string; order: string }): void => {
		setContentTypesSearchParams({
			...contentTypesSearchParams,
			sort: `meta.${orderBy.key}`,
			direction: orderBy.order === 'desc' ? 1 : -1,
		});
		setActiveSorting(orderBy);
	};

	// todo: check what's inside site.data.contentTypes and adjust return value
	const siteIncludesContentType = (contentType: ContentTypeModel): boolean => 
		site?.data.contentTypes.includes(contentType._id) || false;

	/**
	 * Render
	 */

	const renderOverview = (): ReactElement | null => {
		console.log('in renderOverview');
		if (!meta) {
			return null;
		}

		const contentTypesRows: ContentTypesPerSiteOverviewTableRow[] = contentTypes.map(contentType => ({
			uuid: contentType.uuid as string,
			label: contentType.meta.label,
			description: contentType.meta.description,
			amount: contentType.fields.length || 0,
			activated: siteIncludesContentType(contentType),
			navigate: (contentTypeUuid: any) => navigate(MODULE_PATHS.detail, { contentTypeUuid }),
		}));

		return (
			<>
				<PaginatedTable
					className="u-margin-top"
					columns={CONTENT_TYPE_OVERVIEW_COLUMNS(t, mySecurityrights)}
					rows={contentTypesRows}
					currentPage={
						Math.ceil(meta.skip / DEFAULT_CONTENT_TYPES_SEARCH_PARAMS.limit) + 1
					}
					itemsPerPage={DEFAULT_CONTENT_TYPES_SEARCH_PARAMS.limit}
					onPageChange={handlePageChange}
					orderBy={handleOrderBy}
					activeSorting={activeSorting}
					totalValues={meta.total || 0}
					loading={loadingContentTypes === LoadingState.Loading}
				/>
			</>
		);
	};

	return (
		<>
			<ContextHeader title="Content types">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
				<ContextHeaderActionsSection>
					<Button iconLeft="plus" onClick={() => navigate(MODULE_PATHS.create)}>
						{t(CORE_TRANSLATIONS['BUTTON_CREATE-NEW'])}
					</Button>
				</ContextHeaderActionsSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={initialLoading} render={renderOverview} />
			</Container>
		</>
	);
};

export default ContentTypesOverview;
