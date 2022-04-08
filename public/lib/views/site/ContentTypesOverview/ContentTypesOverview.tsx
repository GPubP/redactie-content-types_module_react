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

import { FilterForm, FilterFormState } from '../../../components';
import rolesRightsConnector from '../../../connectors/rolesRights';
import sitesConnector from '../../../connectors/sites';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';
import {
	DEFAULT_OVERVIEW_QUERY_PARAMS,
	MODULE_PATHS,
	OVERVIEW_QUERY_PARAMS_CONFIG,
} from '../../../contentTypes.const';
import { OverviewFilterItem } from '../../../contentTypes.types';
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
	] = rolesRightsConnector.api.hooks.useMySecurityRightsForSite({
		siteUuid: siteId,
		onlyKeys: true,
	});
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
	const createFilterItems = ({ name }: FilterFormState): OverviewFilterItem[] => [
		...(name
			? [
					{
						filterKey: 'search',
						valuePrefix: 'Zoekterm',
						value: name,
					},
			  ]
			: []),
	];

	const onSubmit = (filterFormState: FilterFormState): void => {
		setQuery({
			search: filterFormState.name,
			skip: 0,
		});
	};

	const deleteAllFilters = (): void => {
		setQuery(DEFAULT_OVERVIEW_QUERY_PARAMS);
	};

	const deleteFilter = (item: OverviewFilterItem): void => {
		setQuery({
			skip: 0,
			[item.filterKey]: undefined,
		});
	};

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

	const filterFormState: FilterFormState = { name: query.search ?? '' };
	const activeFilters = createFilterItems(filterFormState);
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
				<div className="u-margin-top">
					<FilterForm
						initialState={filterFormState}
						onCancel={deleteAllFilters}
						onSubmit={onSubmit}
						deleteActiveFilter={deleteFilter}
						activeFilters={activeFilters}
					/>
				</div>
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
