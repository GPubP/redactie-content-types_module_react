import { Button } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip, TooltipTypeMap } from '@acpaas-ui/react-editorial-components';
import { TranslateFunc } from '@redactie/translations-module';
import { TableColumn } from '@redactie/utils';
import React from 'react';

import { SiteStatus } from '../../../components';
import { CORE_TRANSLATIONS } from '../../../connectors/translations';

import { SitesOverviewRowData } from './ContentTypesSites.types';

export const DETAIL_SITES_COLUMNS = (
	t: TranslateFunc,
	contentTypeId: string,
	removeCTsFromSites: (id: string) => void,
	setCTsOnSites: (id: string) => void
): TableColumn<SitesOverviewRowData>[] => [
	{
		label: 'Site',
		value: 'name',
		width: '35%',
		component(name: string, { description }) {
			return (
				<div>
					<p>
						<EllipsisWithTooltip type={TooltipTypeMap.PRIMARY}>
							{name}
						</EllipsisWithTooltip>
					</p>
					<p className="u-text-light">
						<EllipsisWithTooltip type={TooltipTypeMap.PRIMARY}>
							{description}
						</EllipsisWithTooltip>
					</p>
				</div>
			);
		},
	},
	{
		label: 'Aantal content items',
		width: '25%',
		value: 'contentItems',
		disableSorting: true,
		component(contentItemsAmount: number | undefined) {
			return <div>{contentItemsAmount ?? 0}</div>;
		},
	},
	{
		label: 'Status Site',
		value: 'active',
		width: '10%',
		component(active: boolean | undefined) {
			return <SiteStatus active={!!active} />;
		},
	},
	{
		label: '',
		disableSorting: true,
		classList: ['u-text-right'],
		width: '25%',
		component(value, { contentItems, contentTypes, id, isUpdating }) {
			const isActive = (contentTypes || []).includes(contentTypeId);

			if (isActive) {
				return (
					<Button
						iconLeft={isUpdating ? 'circle-o-notch fa-spin' : null}
						disabled={isUpdating || contentItems > 0}
						onClick={() => {
							removeCTsFromSites(id);
						}}
						type="danger"
						outline
					>
						{t(CORE_TRANSLATIONS.BUTTON_DEACTIVATE)}
					</Button>
				);
			}

			return (
				<Button
					iconLeft={isUpdating ? 'circle-o-notch fa-spin' : null}
					disabled={isUpdating}
					onClick={() => {
						setCTsOnSites(id);
					}}
					type="success"
					outline
				>
					{t(CORE_TRANSLATIONS.BUTTON_ACTIVATE)}
				</Button>
			);
		},
	},
];
