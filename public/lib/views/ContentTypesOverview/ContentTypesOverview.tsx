import { Button } from '@acpaas-ui/react-components';
import {
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	Table,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import DataLoader from '../../components/DataLoader/DataLoader';
import { BREADCRUMB_OPTIONS } from '../../content-types.const';
import { getContentTypes } from '../../content-types.service';
import { ContentTypeSchema, ContentTypesRouteProps } from '../../content-types.types';
import useRoutes from '../../hooks/useRoutes/useRoutes';
import { LoadingState } from '../../types';

const ContentTypesOverview: FC<ContentTypesRouteProps> = ({ basePath }) => {
	/**
	 * Hooks
	 */
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [contentTypes, setContentTypes] = useState<ContentTypeSchema[] | null>(null);
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], BREADCRUMB_OPTIONS);
	const history = useHistory();

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
			id: contentType.uuid,
			name: contentType.data.name,
			description: contentType.data.description,
			status: contentType.data.status,
		}));

		const contentTypesColumns = [
			{
				label: 'Naam',
				value: 'name',
			},
			{
				label: 'Gebruikt op',
				value: 'description',
			},
			{
				label: 'Status',
				value: 'status',
			},
			{
				label: '',
				classList: ['u-text-right'],
				disableSorting: true,
				component(value: unknown, rowData: unknown) {
					// TODO: add types for rowData
					const { id } = rowData as any;

					return (
						<Button
							ariaLabel="Edit"
							icon="edit"
							onClick={() => history.push(`${basePath}/${id}/bewerken`)}
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
					<Button iconLeft="plus" onClick={() => history.push(`${basePath}/aanmaken`)}>
						Nieuwe maken
					</Button>
				</ContextHeaderActionsSection>
			</ContextHeader>
			<DataLoader loadingState={loadingState} render={renderOverview} />
		</>
	);
};

export default ContentTypesOverview;
