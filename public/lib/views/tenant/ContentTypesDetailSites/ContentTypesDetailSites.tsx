import { Button } from '@acpaas-ui/react-components';
import { PaginatedTable } from '@acpaas-ui/react-editorial-components';
import { AlertContainer, useAPIQueryParams } from '@redactie/utils';
import React, { FC, useEffect, useMemo, useState } from 'react';

import DataLoader from '../../../components/DataLoader/DataLoader';
import SiteStatus from '../../../components/SiteStatus/SiteStatus';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';
import { ALERT_CONTAINER_IDS } from '../../../contentTypes.const';
import { ContentTypesDetailRouteProps, LoadingState } from '../../../contentTypes.types';
import { useSitesLoadingStates, useSitesPagination } from '../../../hooks';
import { SearchParams } from '../../../services/api';
import { parseOrderBy, parseOrderByString } from '../../../services/helpers/helpers.service';
import { Site, SitesDetailRequestBody } from '../../../services/sites';
import { sitesFacade } from '../../../store/sites';
import { OrderBy } from '../ContentTypesOverview';

import { SitesOverviewRowData } from './ContentTypesSites.types';

const ContentTypeSites: FC<ContentTypesDetailRouteProps> = ({ contentType }) => {
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [t] = useCoreTranslation();
	const [query, setQuery] = useAPIQueryParams({
		sort: {
			defaultValue: 'data.name',
			type: 'string',
		}
	});
	const sitesActiveSorting = useMemo(() => parseOrderByString(query.sort), [query.sort]);
	const sitesPagination = useSitesPagination(query as SearchParams);
	const sitesLoadingStates = useSitesLoadingStates();

	useEffect(() => {
		if ((sitesLoadingStates.isFetching === LoadingState.Loaded ||
			sitesLoadingStates.isFetching === LoadingState.Error)) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [sitesLoadingStates.isFetching]);

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

	const getOgSite = (siteUuid: string): Site | undefined => {
		if (!sitesPagination) {
			return;
		}

		return sitesPagination.data?.find((s: Site) => s.uuid === siteUuid);
	};

	const setCTsOnSites = (siteUuid: string): void => {
		const ogSite = getOgSite(siteUuid);

		if (!ogSite) {
			return;
		}

		const updateBody: SitesDetailRequestBody = {
			...(ogSite as Site).data,
			contentTypes: ogSite.data.contentTypes.concat(contentType._id),
		};

		// TODO: quick user sites module and stores
		sitesFacade.updateSite(ogSite.uuid, updateBody);
	};

	const removeCTsFromSites = (siteUuid: string): void => {
		const ogSite = getOgSite(siteUuid);

		if (!ogSite) {
			return;
		}

		const updateBody: SitesDetailRequestBody = {
			...(ogSite as Site).data,
			contentTypes: ogSite.data.contentTypes.filter(
				(ctId: string) => ctId !== contentType._id
			),
		};

		// TODO: use sites module and stores
		sitesFacade.updateSite(ogSite.uuid, updateBody);
	};

	const SitesTable = (): React.ReactElement | null => {
		if (!sitesPagination) {
			return null;
		}

		const sitesRows: SitesOverviewRowData[] = sitesPagination.data.map(site => ({
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

					if (isActive) {
						return (
							<Button
								onClick={() => removeCTsFromSites(rowData.id)}
								type="danger"
								outline
							>
								{t(CORE_TRANSLATIONS.BUTTON_DEACTIVATE)}
							</Button>
						);
					}

					return (
						<Button onClick={() => setCTsOnSites(rowData.id)} type="success" outline>
							{t(CORE_TRANSLATIONS.BUTTON_ACTIVATE)}
						</Button>
					);
				},
			},
		];

		return (
			<>
				<div className="u-margin-bottom">
					<AlertContainer containerId={ALERT_CONTAINER_IDS.detailSites} />
				</div>
				<p className="u-margin-bottom">
					Bepaal op welke sites dit content type geactiveerd mag worden. Opgelet, u kan
					het content type enkel deactiveren wanneer er géén content items van dit type
					meer bestaan binnen de desbetreffende site.
				</p>
				<PaginatedTable
					className="u-margin-top"
					columns={sitesColumns}
					rows={sitesRows}
					currentPage={sitesPagination.currentPage}
					itemsPerPage={query.pagesize}
					onPageChange={handlePageChange}
					orderBy={handleOrderBy}
					noDataMessage="Er zijn geen resultaten voor de ingestelde filters"
					loadDataMessage="Sites ophalen"
					activeSorting={sitesActiveSorting}
					totalValues={sitesPagination.total}
					loading={sitesLoadingStates.isFetching === LoadingState.Loading}
				></PaginatedTable>
			</>
		);
	};

	return <DataLoader loadingState={initialLoading} render={SitesTable} />;
};

export default ContentTypeSites;
