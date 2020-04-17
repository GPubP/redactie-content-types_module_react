/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	Table,
} from '@acpaas-ui/react-editorial-components';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { DataLoader } from '../../components';
import FilterForm from '../../components/FilterForm/FilterForm';
import { generateFilterFormState } from '../../content-types.helpers';
import { MODULE_PATHS } from '../../contentTypes.const';
import { ContentTypesRouteProps, FilterFormState } from '../../contentTypes.types';
import { useNavigate, useRoutesBreadcrumbs } from '../../hooks';
import useContentTypes from '../../hooks/useContentTypes/useContentTypes';
import { DEFAULT_CONTENT_TYPES_SEARCH_PARAMS } from '../../services/contentTypes/contentTypes.service.cont';
import { FilterItemSchema } from '../../services/filterItems/filterItems.service.types';
import { LoadingState } from '../../types';

import { CONTENT_TYPE_OVERVIEW_COLUMNS } from './ContentTypesOverview.const';
import { ContentTypesOverviewTableRow } from './ContentTypesOverview.types';

const ContentTypesOverview: FC<ContentTypesRouteProps> = () => {
	/**
	 * Hooks
	 */
	const [filterItems, setFilterItems] = useState<FilterItemSchema[]>([]);
	const [contentTypesSearchParams, setContentTypesSearchParams] = useState(
		DEFAULT_CONTENT_TYPES_SEARCH_PARAMS
	);
	const { navigate } = useNavigate();
	const breadcrumbs = useRoutesBreadcrumbs();
	const [loadingState, contentTypes] = useContentTypes(contentTypesSearchParams);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);

	useEffect(() => {
		if (loadingState === LoadingState.Loaded || loadingState === LoadingState.Error) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [loadingState]);

	/**
	 * Functions
	 */
	const onSubmit = ({ name }: FilterFormState): void => {
		//add item to filterItems for Taglist
		const request = { label: name, value: name };
		const setFilter = filterItems?.concat(request);
		setFilterItems(setFilter);
		//get value array from filterItems
		const names = setFilter.map(item => {
			return item['value'];
		});
		//add array to searchParams
		setContentTypesSearchParams({
			...contentTypesSearchParams,
			search: names,
		});
	};

	const deleteAllFilters = (): void => {
		//set empty array as Taglist
		const emptyFilter: [] = [];
		setFilterItems(emptyFilter);
		//delete search param from api call
		setContentTypesSearchParams({
			skip: 1,
			limit: 10,
		});
	};

	const deleteFilter = (item: any): void => {
		//delete item from filterItems
		const setFilter = filterItems?.filter(el => el.value !== item.value);
		setFilterItems(setFilter);
		//get value array from filterItems
		const names = setFilter.map(item => {
			return item['value'];
		});
		//add array to searchParams
		setContentTypesSearchParams({
			...contentTypesSearchParams,
			search: names,
		});
	};

	/**
	 * Render
	 */
	const renderOverview = (): ReactElement | null => {
		if (!contentTypes) {
			return null;
		}

		const contentTypesRows: ContentTypesOverviewTableRow[] = contentTypes.map(contentType => ({
			uuid: contentType.uuid,
			name: contentType.meta.label,
			description: contentType.meta.description,
			status: contentType.meta.status || 'N/A',
			navigate: contentTypeUuid => navigate(MODULE_PATHS.detail, { contentTypeUuid }),
		}));

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
				<h5 className="u-margin-top">Resultaat ({contentTypesRows.length})</h5>
				<Table
					className="u-margin-top"
					rows={contentTypesRows}
					columns={CONTENT_TYPE_OVERVIEW_COLUMNS}
				/>
			</div>
		);
	};

	return (
		<>
			<ContextHeader title="Content types">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
				<ContextHeaderActionsSection>
					<Button iconLeft="plus" onClick={() => navigate(MODULE_PATHS.create)}>
						Nieuwe maken
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
