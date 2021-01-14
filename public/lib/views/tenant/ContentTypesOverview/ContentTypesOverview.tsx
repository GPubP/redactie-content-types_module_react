/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import { SiteModel } from '@redactie/sites-module';
import { DataLoader, LoadingState, useNavigate } from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { FilterForm, FilterFormState } from '../../../components';
import rolesRightsConnector from '../../../connectors/rolesRights';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';
import { MODULE_PATHS } from '../../../contentTypes.const';
import { ContentTypesRouteProps } from '../../../contentTypes.types';
import { useContentTypes, useRoutesBreadcrumbs } from '../../../hooks';
import useSites from '../../../hooks/useSites/useSites';
import { DEFAULT_CONTENT_TYPES_SEARCH_PARAMS } from '../../../services/contentTypes/contentTypes.service.cont';
import { ContentTypeModel, contentTypesFacade } from '../../../store/contentTypes';

import {
	CONTENT_INITIAL_FILTER_STATE,
	CONTENT_TYPE_OVERVIEW_COLUMNS,
} from './ContentTypesOverview.const';
import {
	ContentTypesOverviewTableRow,
	FilterItemSchema,
	OrderBy,
} from './ContentTypesOverview.types';

const ContentTypesOverview: FC<ContentTypesRouteProps> = () => {
	/**
	 * Hooks
	 */
	const [filterItems, setFilterItems] = useState<FilterItemSchema[]>([]);
	const [filterFormState, setFilterFormState] = useState<FilterFormState>(
		CONTENT_INITIAL_FILTER_STATE()
	);
	const [contentTypesSearchParams, setContentTypesSearchParams] = useState(
		DEFAULT_CONTENT_TYPES_SEARCH_PARAMS
	);
	const { navigate } = useNavigate();
	const breadcrumbs = useRoutesBreadcrumbs();
	const [loadingContentTypes, contentTypes, meta] = useContentTypes();
	const [loadingSites, sites] = useSites();
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [activeSorting, setActiveSorting] = useState<OrderBy>();
	const [
		mySecurityRightsLoadingState,
		mySecurityrights,
	] = rolesRightsConnector.api.hooks.useMySecurityRightsForTenant(true);
	const [t] = useCoreTranslation();

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
		contentTypesFacade.getContentTypes(contentTypesSearchParams);
	}, [contentTypesSearchParams]);

	/**
	 * Functions
	 */
	const createFilterItems = ({
		name,
	}: FilterFormState): {
		filters: FilterItemSchema[];
	} => {
		const filters = [
			{
				filterKey: 'search',
				valuePrefix: 'Zoekterm',
				value: name,
			},
		];

		return {
			filters: [...filters].filter(item => !!item.value),
		};
	};

	const onSubmit = (filterFormState: FilterFormState): void => {
		// Update filters
		setFilterFormState(filterFormState);
		const filterItems = createFilterItems(filterFormState);
		setFilterItems(filterItems.filters);
		// Update searchParams
		setContentTypesSearchParams({
			...contentTypesSearchParams,
			search: filterFormState.name,
			skip: 0,
		});
	};

	const deleteAllFilters = (): void => {
		// Reset filters
		setFilterItems([]);
		// Reset search params and filter form
		setContentTypesSearchParams(DEFAULT_CONTENT_TYPES_SEARCH_PARAMS);
		setFilterFormState(CONTENT_INITIAL_FILTER_STATE());
	};

	const deleteFilter = (item: any): void => {
		// Delete item from filters
		const setFilter = filterItems?.filter(el => el.value !== item.value);
		setFilterItems(setFilter);
		// Update searchParams
		setContentTypesSearchParams(DEFAULT_CONTENT_TYPES_SEARCH_PARAMS);
		setFilterFormState({
			...filterFormState,
			[item.filterKey]: '',
		});
	};

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

	const findSitesForContentType = (contentType: ContentTypeModel): any =>
		sites.reduce((acc: string[], site: SiteModel) => {
			const containsCT = site.data.contentTypes.includes(contentType._id);

			if (!containsCT) {
				return acc;
			}

			acc.push(site.data.name);

			return acc;
		}, []);

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
			sites: findSitesForContentType(contentType),
			contentItemCount: contentType.meta.contentItemCount || 0,
			deleted: contentType.meta.deleted || false,
			navigate: contentTypeUuid => navigate(MODULE_PATHS.detailCC, { contentTypeUuid }),
		}));

		return (
			<>
				<div className="u-margin-top">
					<FilterForm
						initialState={CONTENT_INITIAL_FILTER_STATE()}
						onCancel={deleteAllFilters}
						onSubmit={onSubmit}
						deleteActiveFilter={deleteFilter}
						activeFilters={filterItems}
					/>
				</div>
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
