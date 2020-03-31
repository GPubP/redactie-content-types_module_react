import { Table } from '@acpaas-ui/react-editorial-components';
import React, { FC } from 'react';

import SiteStatus from '../SiteStatus/SiteStatus';

import { ContentTypeRow } from './ContentTypeSites.types';
import { DummySites } from './_temp.cts';

const ContentTypeSites: FC = () => {
	const initialState = DummySites;
	/**
	 * Hooks
	 */

	/**
	 * Methods
	 */

	const sitesRows: ContentTypeRow[] = initialState.map(site => ({
		name: site.name,
		description: site.description,
		contentItems: site.contentItems,
		status: site.active ? 'Actief' : 'Niet actief',
	}));

	const sitesColumns = [
		{
			label: 'Site',
			component(value: any, rowData: ContentTypeRow) {
				return (
					<div>
						<p>{rowData.name}</p>
						<p className="u-text-light">{rowData.description}</p>
					</div>
				);
			},
		},
		{
			label: 'Aantal content items',
			value: 'contentItems',
		},
		{
			label: 'Status',
			component(value: string, rowData: ContentTypeRow) {
				const isActive = !!rowData['status'];
				return <SiteStatus active={isActive} />;
			},
		},
	];

	return (
		<>
			<p>
				Bepaal op welke sites dit content type geactiveerd mag worden. Opgelet, u kan het
				content type enkel deactiveren wanneer er géén content items van dit type meer
				bestaan binnen de desbetreffende site.
			</p>
			<Table className="u-margin-top" columns={sitesColumns} rows={sitesRows}></Table>
		</>
	);
};

export default ContentTypeSites;
