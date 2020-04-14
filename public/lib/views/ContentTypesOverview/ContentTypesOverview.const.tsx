import { Button } from '@acpaas-ui/react-components';
import React from 'react';

import { ContentTypesOverviewTableRow } from './ContentTypesOverview.types';

export const CONTENT_TYPE_OVERVIEW_COLUMNS = [
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
		component(value: unknown, rowData: ContentTypesOverviewTableRow) {
			const { contentTypeUuid, navigate } = rowData;

			return (
				<Button
					ariaLabel="Edit"
					icon="edit"
					onClick={() => navigate(contentTypeUuid)}
					type="primary"
					transparent
				></Button>
			);
		},
	},
];
