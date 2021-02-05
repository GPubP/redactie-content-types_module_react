import { Link as AUILink, Button } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip } from '@acpaas-ui/react-editorial-components';
import { TranslateFunc } from '@redactie/translations-module';
import React from 'react';
import { Link } from 'react-router-dom';

import { FilterFormState, SiteStatus } from '../../../components';
import rolesRightsConnector from '../../../connectors/rolesRights';
import { CORE_TRANSLATIONS } from '../../../connectors/translations';

import { ContentTypesOverviewTableRow } from './ContentTypesOverview.types';

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
			width: canUpdate ? '30%' : '35%',
			component(label: string, { uuid, description }: ContentTypesOverviewTableRow) {
				return (
					<>
						<AUILink to={`${uuid}/instellingen`} component={Link}>
							<EllipsisWithTooltip>{label}</EllipsisWithTooltip>
						</AUILink>
						<p className="small">
							{description ? (
								<EllipsisWithTooltip>{description}</EllipsisWithTooltip>
							) : (
								<span className="u-text-italic">
									{t(CORE_TRANSLATIONS['TABLE_NO-DESCRIPTION'])}
								</span>
							)}
						</p>
					</>
				);
			},
		},
		{
			label: 'Gebruikt op',
			value: 'sites',
			ellipsis: true,
			disableSorting: true,
			width: canUpdate ? '25%' : '30%',
		},
		{
			label: 'Aantal content items',
			width: '15%',
			component(value: any, rowData: ContentTypesOverviewTableRow) {
				return rowData.contentItemCount > 0 ? (
					<span>{rowData.contentItemCount}</span>
				) : (
					<span className="u-text-light">Geen</span>
				);
			},
			disableSorting: true,
		},
		{
			label: t(CORE_TRANSLATIONS.TABLE_STATUS),
			width: canUpdate ? '10%' : '15%',
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
			width: '10%',
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
