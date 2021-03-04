import { Link as AUILink, Button } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip } from '@acpaas-ui/react-editorial-components';
import { TranslateFunc } from '@redactie/translations-module';
import { TableColumn } from '@redactie/utils';
import React from 'react';
import { Link } from 'react-router-dom';

import { SiteStatus } from '../../../components';
import rolesRightsConnector from '../../../connectors/rolesRights';
import { CORE_TRANSLATIONS } from '../../../connectors/translations';

import { ContentTypesPerSiteOverviewTableRow } from './ContentTypesOverview.types';

export const CONTENT_TYPE_OVERVIEW_COLUMNS = (
	t: TranslateFunc,
	mySecurityRights: string[]
): TableColumn<ContentTypesPerSiteOverviewTableRow>[] => {
	const canUpdate = rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityRights, [
		rolesRightsConnector.securityRights.update,
	]);
	const defaultColumns: TableColumn<ContentTypesPerSiteOverviewTableRow>[] = [
		{
			label: t(CORE_TRANSLATIONS.TABLE_NAME),
			value: 'label',
			width: canUpdate ? '40%' : '50%',
			component(label: string, { uuid, description }) {
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
			label: 'Aantal content items',
			value: 'contentItemCount',
			width: canUpdate ? '25%' : '30%',
			component(contentItemCount: number) {
				return contentItemCount > 0 ? (
					<span>{contentItemCount}</span>
				) : (
					<span className="u-text-light">Geen</span>
				);
			},
			disableSorting: true,
		},
		{
			label: 'Status voor site',
			value: 'activated',
			width: '20%',
			disableSorting: true,
			component(activated: boolean) {
				return <SiteStatus active={activated} />;
			},
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
			width: '15%',
			component(value, { navigate, uuid }) {
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
