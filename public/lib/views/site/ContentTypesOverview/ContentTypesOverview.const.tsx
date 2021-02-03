import { Link as AUILink, Button } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip, TooltipTypeMap } from '@acpaas-ui/react-editorial-components';
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
							<EllipsisWithTooltip type={TooltipTypeMap.PRIMARY}>
								{value}
							</EllipsisWithTooltip>
						</AUILink>
						<p className="u-text-light u-margin-top-xs">
							<EllipsisWithTooltip type={TooltipTypeMap.PRIMARY}>
								{rowData?.description}
							</EllipsisWithTooltip>
						</p>
					</>
				);
			},
		},
		{
			label: 'Aantal content items',
			width: '200px',
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
			width: '100px',
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
			width: '100px',
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
