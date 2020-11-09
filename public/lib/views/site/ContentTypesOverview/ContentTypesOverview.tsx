import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import React, { ReactElement, useEffect, useState } from 'react';

import { DataLoader } from '../../../components';
import rolesRightsConnector from '../../../connectors/rolesRights';
import { useCoreTranslation } from '../../../connectors/translations';
import { MODULE_PATHS } from '../../../contentTypes.const';
import { LoadingState } from '../../../contentTypes.types';
import {
	useContentTypes,
	useNavigate,
	useRoutesBreadcrumbs,
	useSite,
	useTenantContext,
} from '../../../hooks';
import { DEFAULT_CONTENT_TYPES_SEARCH_PARAMS } from '../../../services/contentTypes/contentTypes.service.cont';
import { ContentTypeModel, contentTypesFacade } from '../../../store/contentTypes';
import { sitesFacade } from '../../../store/sites';
import { OrderBy } from '../../tenant';

import { CONTENT_TYPE_OVERVIEW_COLUMNS } from './ContentTypesOverview.const';
import { ContentTypesPerSiteOverviewTableRow } from './ContentTypesOverview.types';

const ContentTypesOverview: React.FC = () => {
	/**
	 * Hooks
	 */
	const breadcrumbs = useRoutesBreadcrumbs([
		{
			name: 'Structuur',
			target: '',
		},
	]);
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
	const { siteId } = useTenantContext();

	useEffect(() => {
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
	}, [siteId]);

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

	const siteIncludesContentType = (contentType: ContentTypeModel): boolean =>
		site?.data.contentTypes.includes(contentType._id) || false;

	/**
	 * Render
	 */

	const renderOverview = (): ReactElement | null => {
		if (!meta) {
			return null;
		}

		const contentTypesRows: ContentTypesPerSiteOverviewTableRow[] = contentTypes.map(
			contentType => ({
				uuid: contentType.uuid as string,
				label: contentType.meta.label,
				description: contentType.meta.description,
				contentItemCount: contentType.meta.contentItemCount || 0,
				activated: siteIncludesContentType(contentType),
				navigate: (contentTypeUuid: string) =>
					navigate(`/sites${MODULE_PATHS.site.detail}`, { siteId, contentTypeUuid }),
			})
		);

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
			</ContextHeader>
			<Container>
				<DataLoader loadingState={initialLoading} render={renderOverview} />
			</Container>
		</>
	);
};

export default ContentTypesOverview;
