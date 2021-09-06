import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import {
	DataLoader,
	LoadingState,
	OrderBy,
	parseObjToOrderBy,
	parseOrderByToObj,
	SearchParams,
	useAPIQueryParams,
	useNavigate,
	useSiteContext,
} from '@redactie/utils';
import React, { ReactElement, useEffect, useState } from 'react';

import rolesRightsConnector from '../../../connectors/rolesRights';
import sitesConnector from '../../../connectors/sites';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';
import {
	DEFAULT_OVERVIEW_QUERY_PARAMS,
	MODULE_PATHS,
	OVERVIEW_QUERY_PARAMS_CONFIG,
} from '../../../contentTypes.const';
import { useContentTypes, useRoutesBreadcrumbs } from '../../../hooks';
import { ContentTypeModel, contentTypesFacade } from '../../../store/contentTypes';

import { CONTENT_TYPE_OVERVIEW_COLUMNS } from './ContentTypesOverview.const';
import { ContentTypesPerSiteOverviewTableRow } from './ContentTypesOverview.types';

const ContentTypesOverview: React.FC = () => {
	/**
	 * Hooks
	 */

	const breadcrumbs = useRoutesBreadcrumbs(undefined, undefined, true);
	const { navigate } = useNavigate();
	const [t] = useCoreTranslation();
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [loadingContentTypes, contentTypes, meta] = useContentTypes();
	const { siteId } = useSiteContext();
	const [site, siteUI] = sitesConnector.hooks.useSite(siteId);
	const [
		mySecurityRightsLoadingState,
		mySecurityrights,
	] = rolesRightsConnector.api.hooks.useMySecurityRightsForTenant(true);
	const [query, setQuery] = useAPIQueryParams(OVERVIEW_QUERY_PARAMS_CONFIG(), false);

	useEffect(() => {
		if (
			loadingContentTypes !== LoadingState.Loading &&
			!siteUI?.isFetching &&
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
		meta,
		contentTypes,
		site,
		mySecurityrights,
		mySecurityRightsLoadingState,
		siteUI,
	]);

	useEffect(() => {
		contentTypesFacade.getSiteTenantContentTypes(siteId, query as SearchParams);
	}, [query, siteId]);

	/**
	 * Functions
	 */

	const handlePageChange = (page: number): void => {
		setQuery({
			skip: (page - 1) * DEFAULT_OVERVIEW_QUERY_PARAMS.limit,
		});
	};

	const handleOrderBy = (orderBy: OrderBy): void => {
		setQuery(
			parseOrderByToObj({
				...orderBy,
				key: `meta.${orderBy.key}`,
			})
		);
	};

	const activeSorting = parseObjToOrderBy({
		sort: query.sort ? query.sort.split('.')[1] : '',
		direction: query.direction ?? 1,
	});
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
					fixed
					tableClassName="a-table--fixed--sm"
					className="u-margin-top"
					columns={CONTENT_TYPE_OVERVIEW_COLUMNS(t, mySecurityrights)}
					rows={contentTypesRows}
					currentPage={Math.ceil(meta.skip / DEFAULT_OVERVIEW_QUERY_PARAMS.limit) + 1}
					itemsPerPage={DEFAULT_OVERVIEW_QUERY_PARAMS.limit}
					onPageChange={handlePageChange}
					orderBy={handleOrderBy}
					activeSorting={activeSorting}
					totalValues={meta.total || 0}
					loading={loadingContentTypes === LoadingState.Loading}
					loadDataMessage="Content types ophalen"
					noDataMessage={t(CORE_TRANSLATIONS['TABLE_NO-ITEMS'])}
					hideResultsMessage
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
