import { Button } from '@acpaas-ui/react-components';
import { PaginatedTable } from '@acpaas-ui/react-editorial-components';
import { SiteModel, UpdateSitePayload } from '@redactie/sites-module';
import { AlertContainer, useAPIQueryParams } from '@redactie/utils';
import React, { FC, useMemo, useState } from 'react';

import SiteStatus from '../../../components/SiteStatus/SiteStatus';
import sitesConnector from '../../../connectors/sites';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';
import { ALERT_CONTAINER_IDS } from '../../../contentTypes.const';
import { ContentTypesDetailRouteProps, LoadingState } from '../../../contentTypes.types';
import { parseOrderBy, parseOrderByString } from '../../../services/helpers/helpers.service';
import { OrderBy } from '../ContentTypesOverview';

import { SitesOverviewRowData } from './ContentTypesSites.types';

const ContentTypeSites: FC<ContentTypesDetailRouteProps> = ({ contentType }) => {
	const [t] = useCoreTranslation();
	const [query, setQuery] = useAPIQueryParams({
		sort: {
			defaultValue: 'data.name',
			type: 'string',
		},
	});
	const [updateSiteId, setUpdateSiteId] = useState<string | null>(null);
	const sitesActiveSorting = useMemo(() => parseOrderByString(query.sort), [query.sort]);
	const [sitesPagination, refreshPage] = sitesConnector.hooks.useSitesPagination(query as any);
	const sitesLoadingStates = sitesConnector.hooks.useSitesLoadingStates();

	const handlePageChange = (pageNumber: number): void => {
		setQuery({
			...query,
			page: pageNumber,
		});
	};

	const handleOrderBy = (orderBy: OrderBy): void => {
		setQuery({
			...query,
			sort: parseOrderBy({
				...orderBy,
				key: `${orderBy.key === 'active' ? 'meta' : 'data'}.${orderBy.key}`,
			}),
		});
	};

	const getOgSite = (siteUuid: string): SiteModel | undefined => {
		if (!sitesPagination) {
			return;
		}

		return sitesPagination.data?.find((s: SiteModel) => s.uuid === siteUuid);
	};

	const setCTsOnSites = (siteUuid: string): void => {
		const ogSite = getOgSite(siteUuid);

		if (!ogSite) {
			return;
		}

		const payload: UpdateSitePayload = {
			id: ogSite.uuid,
			body: {
				...ogSite.data,
				contentTypes: ogSite.data.contentTypes.concat(contentType._id),
			},
		};

		sitesConnector.sitesFacade.updateSite(payload).finally(() => refreshPage());
	};

	const removeCTsFromSites = (siteUuid: string): void => {
		const ogSite = getOgSite(siteUuid);

		if (!ogSite) {
			return;
		}

		const payload: UpdateSitePayload = {
			id: ogSite.uuid,
			body: {
				...ogSite.data,
				contentTypes: ogSite.data.contentTypes.filter(
					(ctId: string) => ctId !== contentType._id
				),
			},
		};

		sitesConnector.sitesFacade.updateSite(payload).finally(() => refreshPage());
	};

	const RenderSitesTable = (): React.ReactElement | null => {
		const sitesRows: SitesOverviewRowData[] = (sitesPagination?.data || []).map(site => ({
			id: site.uuid,
			name: site.data.name,
			description: site.data.description,
			active: site.meta.active,
			contentTypes: site.data?.contentTypes,
			contentItems: site.data?.contentTypes?.length ?? 0,
		}));

		const sitesColumns = [
			{
				label: 'Site',
				value: 'name',
				component(value: any, rowData: SitesOverviewRowData) {
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
				disableSorting: true,
				component(value: string) {
					return <div>{value || 0}</div>;
				},
			},
			{
				label: t(CORE_TRANSLATIONS.TABLE_STATUS),
				value: 'active',
				component(value: string) {
					const isActive = !!value;
					return <SiteStatus active={isActive} />;
				},
			},
			{
				label: '',
				disableSorting: true,
				component(value: string, rowData: SitesOverviewRowData) {
					const isActive = (rowData.contentTypes || []).includes(contentType._id);
					const loading =
						sitesLoadingStates.isUpdating === LoadingState.Loading &&
						updateSiteId === rowData.id;

					if (isActive) {
						return (
							<Button
								iconLeft={loading ? 'circle-o-notch fa-spin' : null}
								disabled={loading}
								onClick={() => {
									setUpdateSiteId(rowData.id);
									removeCTsFromSites(rowData.id);
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
							iconLeft={loading ? 'circle-o-notch fa-spin' : null}
							disabled={loading}
							onClick={() => {
								setUpdateSiteId(rowData.id);
								setCTsOnSites(rowData.id);
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

		return (
			<>
				<AlertContainer
					toastClassName="u-margin-bottom"
					containerId={sitesConnector.config.ALERT_CONTAINER_IDS.fetch}
				/>
				<AlertContainer
					toastClassName="u-margin-bottom"
					containerId={ALERT_CONTAINER_IDS.detailSites}
				/>
				<p className="u-margin-bottom">
					Bepaal op welke sites dit content type geactiveerd mag worden. Opgelet, u kan
					het content type enkel deactiveren wanneer er géén content items van dit type
					meer bestaan binnen de desbetreffende site.
				</p>
				<PaginatedTable
					className="u-margin-top"
					columns={sitesColumns}
					rows={sitesRows}
					currentPage={sitesPagination?.currentPage}
					itemsPerPage={query.pagesize}
					onPageChange={handlePageChange}
					orderBy={handleOrderBy}
					noDataMessage="Er zijn geen resultaten voor de ingestelde filters"
					loadDataMessage="Sites ophalen"
					activeSorting={sitesActiveSorting}
					totalValues={sitesPagination?.total ?? 0}
					loading={sitesLoadingStates.isFetching === LoadingState.Loading}
				/>
			</>
		);
	};

	return RenderSitesTable();
};

export default ContentTypeSites;
