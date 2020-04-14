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
import { MODULE_PATHS } from '../../contentTypes.const';
import { ContentTypesRouteProps } from '../../contentTypes.types';
import { useNavigate, useRoutesBreadcrumbs } from '../../hooks';
import { ContentTypeSchema, getContentTypes } from '../../services/contentTypes';
import { LoadingState } from '../../types';

const ContentTypesOverview: FC<ContentTypesRouteProps> = () => {
	/**
	 * Hooks
	 */
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [contentTypes, setContentTypes] = useState<ContentTypeSchema[] | null>(null);
	const { navigate } = useNavigate();
	const breadcrumbs = useRoutesBreadcrumbs();

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
							onClick={() => navigate(MODULE_PATHS.detail, { contentTypeUuid })}
							type="primary"
							transparent
						></Button>
					);
				},
			},
		];

		return (
			<>
				<h5>Resultaat ({contentTypesRows.length})</h5>
				<Table
					className="u-margin-top"
					rows={contentTypesRows}
					columns={contentTypesColumns}
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
						Nieuwe maken
					</Button>
				</ContextHeaderActionsSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={loadingState} render={renderOverview} />
			</Container>
		</>
	);
};

export default ContentTypesOverview;
