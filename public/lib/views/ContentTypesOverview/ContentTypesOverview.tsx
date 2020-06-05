/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { DataLoader } from '../../components';
import FilterForm from '../../components/FilterForm/FilterForm';
import rolesRightsConnector from '../../connectors/rolesRights';
import { useCoreTranslation } from '../../connectors/translations';
import { generateFilterFormState } from '../../content-types.helpers';
import { MODULE_PATHS } from '../../contentTypes.const';
import { ContentTypesRouteProps, FilterFormState } from '../../contentTypes.types';
import { useNavigate, useRoutesBreadcrumbs } from '../../hooks';
import useContentTypes from '../../hooks/useContentTypes/useContentTypes';
import { DEFAULT_CONTENT_TYPES_SEARCH_PARAMS } from '../../services/contentTypes/contentTypes.service.cont';
import { LoadingState } from '../../types';

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
		CONTENT_INITIAL_FILTER_STATE
	);
	const [contentTypesSearchParams, setContentTypesSearchParams] = useState(
		DEFAULT_CONTENT_TYPES_SEARCH_PARAMS
	);
	const { navigate } = useNavigate();
	const breadcrumbs = useRoutesBreadcrumbs();
	const [loadingState, contentTypes] = useContentTypes(contentTypesSearchParams);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [activeSorting, setActiveSorting] = useState<OrderBy>();
	const [
		mySecurityRightsLoadingState,
		mySecurityrights,
	] = rolesRightsConnector.api.hooks.useMySecurityRightsForTenant(true);
	const [t] = useCoreTranslation();

	useEffect(() => {
		if (
			loadingState !== LoadingState.Loading &&
			mySecurityRightsLoadingState !== LoadingState.Loading
		) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [loadingState, mySecurityRightsLoadingState]);

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
		//add item to filterItems for Taglist
		setFilterFormState(filterFormState);
		const filterItems = createFilterItems(filterFormState);
		setFilterItems(filterItems.filters);
		//add value to searchParams
		setContentTypesSearchParams({
			...contentTypesSearchParams,
			search: filterFormState.name,
			skip: 0,
		});
	};

	const deleteAllFilters = (): void => {
		//set empty array as Taglist
		const emptyFilter: [] = [];
		setFilterItems(emptyFilter);
		//delete search param from api call
		setContentTypesSearchParams(DEFAULT_CONTENT_TYPES_SEARCH_PARAMS);
		setFilterFormState(CONTENT_INITIAL_FILTER_STATE);
	};

	const deleteFilter = (item: any): void => {
		//delete item from filterItems
		const setFilter = filterItems?.filter(el => el.value !== item.value);
		setFilterItems(setFilter);
		//set empty searchParams
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

	/**
	 * Render
	 */
	const renderOverview = (): ReactElement | null => {
		if (!contentTypes?.data) {
			return null;
		}

		const contentTypesRows: ContentTypesOverviewTableRow[] = contentTypes.data.map(
			contentType => ({
				uuid: contentType.uuid,
				label: contentType.meta.label,
				description: contentType.meta.description,
				status: contentType.meta.status || 'N/A',
				navigate: contentTypeUuid => navigate(MODULE_PATHS.detail, { contentTypeUuid }),
			})
		);

		return (
			<div className="u-container u-wrapper">
				<div className="u-margin-top">
					<FilterForm
						initialState={generateFilterFormState()}
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
						Math.ceil(
							contentTypes.paging.skip / DEFAULT_CONTENT_TYPES_SEARCH_PARAMS.limit
						) + 1
					}
					itemsPerPage={DEFAULT_CONTENT_TYPES_SEARCH_PARAMS.limit}
					onPageChange={handlePageChange}
					orderBy={handleOrderBy}
					activeSorting={activeSorting}
					totalValues={contentTypes?.paging?.total || 0}
					loading={loadingState === LoadingState.Loading}
				></PaginatedTable>
			</div>
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
