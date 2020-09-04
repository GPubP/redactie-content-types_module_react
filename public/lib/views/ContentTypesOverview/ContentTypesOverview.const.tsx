import { Link as AUILink, Button } from '@acpaas-ui/react-components';
import { TranslateFunc } from '@redactie/translations-module';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { prop } from 'ramda';
import React from 'react';
import { Link } from 'react-router-dom';

import { SiteStatus } from '../../components';
import rolesRightsConnector from '../../connectors/rolesRights';

import { ContentTypesOverviewTableRow } from './ContentTypesOverview.types';

export const CONTENT_INITIAL_FILTER_STATE = {
	name: '',
};

export const CONTENT_TYPE_OVERVIEW_COLUMNS = (
	t: TranslateFunc,
	mySecurityRights: string[]
): any[] => {
	const canUpdate = rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityRights, [
		rolesRightsConnector.securityRights.update,
	]);
	const defaultColumns = [
		{
			label: t(CORE_TRANSLATIONS.TABLE_NAME),
			value: 'label',
			component(value: any, rowData: ContentTypesOverviewTableRow) {
				return (
					<>
						<AUILink to={`${rowData?.uuid}/instellingen`} component={Link}>
							{value}
						</AUILink>
						<p className="u-text-light u-margin-top-xs">{rowData?.description}</p>
					</>
				);
			},
		},
		{
			label: 'Gebruikt op',
			value: 'sites',
			disableSorting: true,
		},
		{
			label: 'Aantal content items',
			component(value: any, rowData: ContentTypesOverviewTableRow) {
				return rowData.fields > 0 ? (
					<span>{rowData.fields}</span>
				) : (
					<span className="u-text-light">Geen</span>
				);
			},
			disableSorting: true,
		},
		{
			label: t(CORE_TRANSLATIONS.TABLE_STATUS),
			component(value: string, rowData: ContentTypesOverviewTableRow) {
				return <SiteStatus active={!rowData.deleted} />;
			},
			disableSorting: true,
		},
	];

	if (!canUpdate) {
		return defaultColumns;
	}

	return [
		...defaultColumns,
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
};
