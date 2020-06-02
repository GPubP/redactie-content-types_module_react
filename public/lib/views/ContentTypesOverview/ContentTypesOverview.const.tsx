import { Button } from '@acpaas-ui/react-components';
import { TranslateFunc } from '@redactie/translations-module';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import React from 'react';

import { ContentTypesOverviewTableRow } from './ContentTypesOverview.types';

export const CONTENT_INITIAL_FILTER_STATE = {
	name: '',
};

export const CONTENT_TYPE_OVERVIEW_COLUMNS = (t: TranslateFunc): any[] => [
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'label',
	},
	{
		label: 'Gebruikt op',
		value: 'description',
		disableSorting: true,
	},
	{
		label: t(CORE_TRANSLATIONS.TABLE_STATUS),
		value: 'status',
		disableSorting: true,
	},
	{
		label: '',
		classList: ['u-text-right'],
		disableSorting: true,
		component(value: unknown, rowData: ContentTypesOverviewTableRow) {
			const { navigate, uuid } = rowData;

			return (
				<Button
					ariaLabel="Edit"
					icon="edit"
					onClick={() => navigate(uuid)}
					type="primary"
					transparent
				/>
			);
		},
	},
];
