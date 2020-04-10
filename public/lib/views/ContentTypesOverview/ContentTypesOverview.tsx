/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Button } from '@acpaas-ui/react-components';
import {
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	Table,
} from '@acpaas-ui/react-editorial-components';
import { stringify } from 'query-string';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { DataLoader } from '../../components';
import FilterForm from '../../components/FilterForm/FilterForm';
import { generateFilterFormState } from '../../content-types.helpers';
import { MODULE_PATHS } from '../../contentTypes.const';
import { ContentTypesRouteProps, FilterFormState } from '../../contentTypes.types';
import { useNavigate, useRoutesBreadcrumbs } from '../../hooks';
import useContentTypes from '../../hooks/useContentTypes/useContentTypes';
import { ContentTypeSchema } from '../../services/contentTypes';
import { DEFAULT_CONTENT_TYPES_SEARCH_PARAMS } from '../../services/contentTypes/contentTypes.service.cont';
import { FilterItemSchema } from '../../services/filterItems/filterItems.service.types';
import { LoadingState } from '../../types';

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

	const deleteFilter = ({ name }: FilterFormState): void => {
		//delete item from filterItems
		const setFilter = filterItems?.filter(el => el.value !== name);
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

		const contentTypesRows = contentTypes.data.map(contentType => ({
			uuid: contentType.uuid,
			name: contentType.meta.label,
			description: contentType.meta.description,
			status: contentType.meta.status,
		}));

		const contentTypesColumns = [
			{
				label: 'Naam',
				value: 'name',
			},
			{
				label: 'Gebruikt op',
				value: 'description',
				disableSorting: true,
			},
			{
				label: 'Status',
				value: 'status',
				disableSorting: true,
			},
			{
				label: '',
				classList: ['u-text-right'],
				disableSorting: true,
				component(value: unknown, rowData: ContentTypeSchema) {
					const { uuid: contentTypeUuid } = rowData;

					return (
						<Button
							ariaLabel="Edit"
							icon="edit"
							onClick={() => navigate(MODULE_PATHS.edit, { contentTypeUuid })}
							type="primary"
							transparent
						></Button>
					);
				},
			},
		];

		return (
			<div className="u-container u-wrapper">
				<h5 className="u-margin-top">Resultaat ({contentTypesRows.length})</h5>
				<Table
					className="u-margin-top"
					rows={contentTypesRows}
					columns={contentTypesColumns}
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
			<div className="u-margin-top">
				<FilterForm
					initialState={generateFilterFormState()}
					onCancel={deleteAllFilters}
					onSubmit={onSubmit}
					deleteActiveFilter={deleteFilter}
					activeFilters={filterItems}
				/>
			</div>
			<DataLoader loadingState={initialLoading} render={renderOverview} />
		</>
	);
};

export default ContentTypesOverview;
