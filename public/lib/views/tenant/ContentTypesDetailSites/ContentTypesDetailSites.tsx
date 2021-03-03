import { Button } from '@acpaas-ui/react-components';
import {
	EllipsisWithTooltip,
	PaginatedTable,
	TooltipTypeMap,
} from '@acpaas-ui/react-editorial-components';
import { SiteModel, UpdateSitePayload } from '@redactie/sites-module';
import {
	AlertContainer,
	LoadingState,
	OrderBy,
	parseOrderByToString,
	parseStringToOrderBy,
	TableColumn,
	useAPIQueryParams,
} from '@redactie/utils';
import React, { FC, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import SiteStatus from '../../../components/SiteStatus/SiteStatus';
import sitesConnector from '../../../connectors/sites';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';
import { ALERT_CONTAINER_IDS } from '../../../contentTypes.const';
import {
	ContentTypesDetailRouteProps,
	SiteContentTypesDetailRouteParams,
} from '../../../contentTypes.types';

import { SitesOverviewRowData } from './ContentTypesSites.types';

const ContentTypeSites: FC<ContentTypesDetailRouteProps> = ({ contentType }) => {
	const [t] = useCoreTranslation();
	const { contentTypeUuid } = useParams<SiteContentTypesDetailRouteParams>();
	const [query, setQuery] = useAPIQueryParams({
		sort: {
			defaultValue: 'data.name',
			type: 'string',
		},
		'content-type': {
			defaultValue: contentTypeUuid,
			type: 'string',
		},
	});
	const [updateSiteId, setUpdateSiteId] = useState<string | null>(null);
	const sitesActiveSorting = useMemo(() => parseStringToOrderBy(query.sort ?? ''), [query.sort]);
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
			sort: parseOrderByToString({
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
			contentItems: site.meta?.contentItemsCount ?? 0,
		}));

		const sitesColumns: TableColumn<SitesOverviewRowData>[] = [
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
				label: t(CORE_TRANSLATIONS.TABLE_STATUS),
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
				component(value, { contentItems, contentTypes, id }) {
					const isActive = (contentTypes || []).includes(contentType._id);
					const loading =
						sitesLoadingStates.isUpdating === LoadingState.Loading &&
						updateSiteId === id;

					if (isActive) {
						return (
							<Button
								iconLeft={loading ? 'circle-o-notch fa-spin' : null}
								disabled={loading || contentItems > 0}
								onClick={() => {
									setUpdateSiteId(id);
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
							iconLeft={loading ? 'circle-o-notch fa-spin' : null}
							disabled={loading}
							onClick={() => {
								setUpdateSiteId(id);
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
					fixed
					className="u-margin-top"
					tableClassName="a-table--fixed--sm"
					columns={sitesColumns}
					rows={sitesRows}
					currentPage={sitesPagination?.currentPage}
					itemsPerPage={query.pagesize}
					onPageChange={handlePageChange}
					orderBy={handleOrderBy}
					noDataMessage={t(CORE_TRANSLATIONS['TABLE_NO-RESULT'])}
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
