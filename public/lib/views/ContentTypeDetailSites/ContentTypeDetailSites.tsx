import { Button } from '@acpaas-ui/react-components';
import { Container, Table } from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import React, { FC, useEffect, useState } from 'react';

import DataLoader from '../../components/DataLoader/DataLoader';
import SiteStatus from '../../components/SiteStatus/SiteStatus';
import { useCoreTranslation } from '../../connectors/translations';
import { ContentTypesDetailRouteProps } from '../../contentTypes.types';
import useSites from '../../hooks/useSites/useSites';
import { SiteSchema, SitesDetailRequestBody, updateSite } from '../../services/sites';
import { LoadingState } from '../../types';

import { SitesRowData } from './ContentTypeSites.types';

const ContentTypeSites: FC<ContentTypesDetailRouteProps> = ({ contentType }) => {
	const [sitesLoading, sites] = useSites();
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [t] = useCoreTranslation();

	useEffect(() => {
		if (sitesLoading === LoadingState.Loaded) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [sites, sitesLoading]);

	const getOgSite = (siteUuid: string): SiteSchema | undefined =>
		sites?.data.find((s: SiteSchema) => s.uuid === siteUuid);

	const setCTsOnSites = (siteUuid: string): void => {
		const ogSite = getOgSite(siteUuid);

		if (!ogSite) {
			return;
		}

		const updateBody: SitesDetailRequestBody = {
			...(ogSite as SiteSchema).data,
			contentTypes: ogSite.data.contentTypes.concat(contentType._id),
		};

		// TODO: quick user sites module and stores
		updateSite(ogSite.uuid, updateBody).then(() => window.location.reload());
	};

	const removeCTsFromSites = (siteUuid: string): void => {
		const ogSite = getOgSite(siteUuid);

		if (!ogSite) {
			return;
		}

		const updateBody: SitesDetailRequestBody = {
			...(ogSite as SiteSchema).data,
			contentTypes: ogSite.data.contentTypes.filter(
				(ctId: string) => ctId !== contentType._id
			),
		};

		// TODO: use sites module and stores
		updateSite(ogSite.uuid, updateBody).then(() => window.location.reload());
	};

	const SitesTable = (): React.ReactElement | null => {
		if (!sites) {
			return null;
		}

		const sitesRows: SitesRowData[] = sites.data.map(
			(site: SiteSchema): SitesRowData => ({
				uuid: site.uuid,
				name: site.data.name,
				description: site.data.description,
				status: site.meta.active,
				contentTypes: site.data.contentTypes,
				contentItems: 0,
			})
		);

		const sitesColumns = [
			{
				label: 'Site',
				component(value: any, rowData: SitesRowData) {
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
				label: t(CORE_TRANSLATIONS.TABLE_STATUS),
				component(value: string, rowData: SitesRowData) {
					const isActive = !!rowData['status'];
					return <SiteStatus active={isActive} />;
				},
			},
			{
				label: '',
				disableSorting: true,
				component(value: string, rowData: SitesRowData) {
					const isActive = (rowData.contentTypes || []).includes(contentType._id);

					if (rowData.contentItems !== 0) {
						return null;
					}

					if (isActive) {
						return (
							<Button
								onClick={() => removeCTsFromSites(rowData.uuid)}
								type="danger"
								outline
							>
								{t(CORE_TRANSLATIONS.BUTTON_DEACTIVATE)}
							</Button>
						);
					}

					return (
						<Button onClick={() => setCTsOnSites(rowData.uuid)} type="success" outline>
							{t(CORE_TRANSLATIONS.BUTTON_ACTIVATE)}
						</Button>
					);
				},
			},
		];

		return (
			<>
				<p className="u-margin-bottom">
					Bepaal op welke sites dit content type geactiveerd mag worden. Opgelet, u kan
					het content type enkel deactiveren wanneer er géén content items van dit type
					meer bestaan binnen de desbetreffende site.
				</p>
				<Table columns={sitesColumns} rows={sitesRows}></Table>
			</>
		);
	};

	return (
		<Container>
			<DataLoader loadingState={initialLoading} render={SitesTable} />
		</Container>
	);
};

export default ContentTypeSites;
