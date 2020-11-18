import { Link as AUILink, Button } from '@acpaas-ui/react-components';
import { TranslateFunc } from '@redactie/translations-module';
import React from 'react';
import { Link } from 'react-router-dom';

import { FilterFormState, SiteStatus } from '../../../components';
import rolesRightsConnector from '../../../connectors/rolesRights';
import { CORE_TRANSLATIONS } from '../../../connectors/translations';
import { ContentTypesOverviewTableRow } from '../../tenant';

import { ContentTypesPerSiteOverviewTableRow } from './ContentTypesOverview.types';

export const CONTENT_INITIAL_FILTER_STATE = (): FilterFormState => ({
	name: '',
});

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
			label: 'Aantal content items',
			component(value: any, rowData: ContentTypesPerSiteOverviewTableRow) {
				return rowData.contentItemCount > 0 ? (
					<span>{rowData.contentItemCount}</span>
				) : (
					<span className="u-text-light">Geen</span>
				);
			},
			disableSorting: true,
		},
		{
			label: 'Status voor site',
			component(value: string, rowData: ContentTypesPerSiteOverviewTableRow) {
				return <SiteStatus active={rowData.activated} />;
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
