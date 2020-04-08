/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Button } from '@acpaas-ui/react-components';
import {
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	Table,
} from '@acpaas-ui/react-editorial-components';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import FilterForm from '../../components/FilterForm/FilterForm';
import { generateFilterFormState } from '../../content-types.helpers';
import { ContentTypesRouteProps, FilterFormState } from '../../contentTypes.types';
import useRoutes from '../../hooks/useRoutes/useRoutes';
import { DataLoader } from '../../components';
import { MODULE_PATHS } from '../../contentTypes.const';
import { useNavigate, useRoutesBreadcrumbs } from '../../hooks';
import { ContentTypeSchema, getContentTypes } from '../../services/contentTypes';
import { FilterItemSchema } from '../../services/filterItems/filterItems.service.types';
import { LoadingState } from '../../types';

const ContentTypesOverview: FC<ContentTypesRouteProps> = () => {
	/**
	 * Hooks
	 */
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [contentTypes, setContentTypes] = useState<ContentTypeSchema[] | null>(null);
	const [filterItems, setFilterItems] = useState<FilterItemSchema[]>([]);
	const routes = useRoutes();
	const { navigate } = useNavigate();
	const breadcrumbs = useRoutesBreadcrumbs();

	const onSubmit = ({ name }: FilterFormState): void => {
		const request = { name };
		console.log(request);
		setFilterItems(filterItems?.concat(request));
		console.log(filterItems);
	};

	useEffect(() => {
		getContentTypes()
			.then(data => {
				if (data?.length) {
					setContentTypes(data);
				}
				setLoadingState(LoadingState.Loaded);
			})
			.catch(() => {
				setLoadingState(LoadingState.Error);
			});
	}, []);

	/**
	 * Render
	 */
	const renderOverview = (): ReactElement | null => {
		if (!contentTypes) {
			return null;
		}

		const contentTypesRows = contentTypes.map(contentType => ({
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
					onCancel={() => console.log('verwijder filters')}
					onSubmit={onSubmit}
					deleteActiveFilter={() => console.log('verwijder een filter')}
					activeFilters={filterItems}
				/>
			</div>
			<DataLoader loadingState={loadingState} render={renderOverview} />
		</>
	);
};

export default ContentTypesOverview;
