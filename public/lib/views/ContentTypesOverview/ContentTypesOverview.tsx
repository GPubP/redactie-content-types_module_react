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
import { ContentTypeResponse, getContentTypes } from '../../services/contentTypes';
import { LoadingState } from '../../types';

import { CONTENT_TYPE_OVERVIEW_COLUMNS } from './ContentTypesOverview.const';
import { ContentTypesOverviewTableRow } from './ContentTypesOverview.types';

const ContentTypesOverview: FC<ContentTypesRouteProps> = () => {
	/**
	 * Hooks
	 */
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [contentTypes, setContentTypes] = useState<ContentTypeResponse[] | null>(null);
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

		const contentTypesRows: ContentTypesOverviewTableRow[] = contentTypes.map(contentType => ({
			contentTypeUuid: contentType.uuid,
			name: contentType.meta.label,
			description: contentType.meta.description,
			status: contentType.meta.status || 'N/A',
			navigate: contentTypeUuid => navigate(MODULE_PATHS.detail, { contentTypeUuid }),
		}));

		return (
			<>
				<h5>Resultaat ({contentTypesRows.length})</h5>
				<Table
					className="u-margin-top"
					rows={contentTypesRows}
					columns={CONTENT_TYPE_OVERVIEW_COLUMNS}
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
