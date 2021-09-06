/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import { SiteListModel } from '@redactie/sites-module';
import {
	DataLoader,
	LoadingState,
	OrderBy,
	parseObjToOrderBy,
	parseOrderByToObj,
	SearchParams,
	useAPIQueryParams,
	useNavigate,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FilterForm, FilterFormState } from '../../../components';
import rolesRightsConnector from '../../../connectors/rolesRights';
import {
	CORE_TRANSLATIONS,
	useCoreTranslation,
	useModuleTranslation,
} from '../../../connectors/translations';
import {
	DEFAULT_OVERVIEW_QUERY_PARAMS,
	MODULE_PATHS,
	OVERVIEW_QUERY_PARAMS_CONFIG,
} from '../../../contentTypes.const';
import {
	ContentTypesRouteProps,
	CtBaseParams,
	OverviewFilterItem,
} from '../../../contentTypes.types';
import { useContentTypes, useRoutesBreadcrumbs, useSites } from '../../../hooks';
import { MODULE_TRANSLATIONS } from '../../../i18next/translations.const';
import { contentTypesFacade } from '../../../store/contentTypes';

import { CONTENT_TYPE_OVERVIEW_COLUMNS } from './ContentTypesOverview.const';
import { ContentTypesOverviewTableRow } from './ContentTypesOverview.types';

const ContentTypesOverview: FC<ContentTypesRouteProps> = () => {
	/**
	 * Hooks
	 */

	const { ctType } = useParams<CtBaseParams>();
	const [query, setQuery] = useAPIQueryParams(OVERVIEW_QUERY_PARAMS_CONFIG(ctType), false);
	const { navigate } = useNavigate();

	const breadcrumbs = useRoutesBreadcrumbs();
	const [loadingContentTypes, contentTypes, meta] = useContentTypes();
	const [loadingSites, sites] = useSites();
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [
		mySecurityRightsLoadingState,
		mySecurityrights,
	] = rolesRightsConnector.api.hooks.useMySecurityRightsForTenant(true);
	const [t] = useCoreTranslation();
	const [tModule] = useModuleTranslation();
	const TYPE_TRANSLATIONS = MODULE_TRANSLATIONS[ctType];

	useEffect(() => {
		if (
			loadingContentTypes !== LoadingState.Loading &&
			loadingSites !== LoadingState.Loading &&
			mySecurityRightsLoadingState !== LoadingState.Loading &&
			contentTypes &&
			sites &&
			mySecurityrights &&
			meta
		) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [
		loadingContentTypes,
		loadingSites,
		meta,
		contentTypes,
		sites,
		mySecurityrights,
		mySecurityRightsLoadingState,
	]);

	useEffect(() => {
		contentTypesFacade.getContentTypes(query as SearchParams);
	}, [query]);

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

	const sitesForContentTypeList = useMemo(() => {
		return contentTypes.reduce((acc, contentType) => {
			if (contentType.uuid) {
				acc[contentType.uuid] = sites
					.reduce((acc: string[], site: SiteListModel) => {
						const containsCT = site.data.contentTypes.includes(contentType._id);

						if (!containsCT) {
							return acc;
						}

						acc.push(site.data.name);

						return acc;
					}, [])
					.join(', ');
			}

			return acc;
		}, {} as Record<string, any>);
	}, [contentTypes, sites]);

	const filterFormState: FilterFormState = { name: query.search ?? '' };
	const activeFilters = createFilterItems(filterFormState);
	const activeSorting = parseObjToOrderBy({
		sort: query.sort ? query.sort.split('.')[1] : '',
		direction: query.direction ?? 1,
	});

	/**
	 * Render
	 */
	const renderOverview = (): ReactElement | null => {
		if (!meta) {
			return null;
		}

		const contentTypesRows: ContentTypesOverviewTableRow[] = contentTypes.map(contentType => ({
			uuid: contentType.uuid as string,
			label: contentType.meta.label,
			description: contentType.meta.description,
			sites: sitesForContentTypeList[contentType.uuid as string],
			contentItemCount: contentType.meta.contentItemCount || 0,
			deleted: contentType.meta.deleted || false,
			navigate: contentTypeUuid =>
				navigate(MODULE_PATHS.detailCC, { contentTypeUuid, ctType }),
		}));

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
					tableClassName="a-table--fixed--lg"
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
					loadDataMessage={tModule(TYPE_TRANSLATIONS.OVERVIEW_LOADING)}
					noDataMessage={t(CORE_TRANSLATIONS['TABLE_NO-RESULT'])}
				/>
			</>
		);
	};

	return (
		<>
			<ContextHeader title={tModule(TYPE_TRANSLATIONS.OVERVIEW_TITLE)}>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
				<ContextHeaderActionsSection>
					<Button
						iconLeft="plus"
						onClick={() => navigate(MODULE_PATHS.create, { ctType })}
					>
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
