import { Button } from '@acpaas-ui/react-components';
import {
	EllipsisWithTooltip,
	PaginatedTable,
	TooltipTypeMap,
} from '@acpaas-ui/react-editorial-components';
import { SiteListModel, UpdateSitePayload } from '@redactie/sites-module';
import {
	AlertContainer,
	OrderBy,
	parseOrderByToString,
	parseStringToOrderBy,
	TableColumn,
	useAPIQueryParams,
} from '@redactie/utils';
import React, { FC, useEffect, useMemo, useReducer, useRef } from 'react';
import { useParams } from 'react-router-dom';

import SiteStatus from '../../../components/SiteStatus/SiteStatus';
import sitesConnector from '../../../connectors/sites';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';
import { ALERT_CONTAINER_IDS } from '../../../contentTypes.const';
import {
	ContentTypesDetailRouteProps,
	SiteContentTypesDetailRouteParams,
} from '../../../contentTypes.types';

import {
	PaginatedSitesActionTypes,
	paginatedSitesReducer,
} from './ContentTypesDetailSites.reducer';
import { SitesOverviewRowData } from './ContentTypesSites.types';

const ContentTypeSites: FC<ContentTypesDetailRouteProps> = ({ contentType }) => {
	const [t] = useCoreTranslation();
	const { contentTypeUuid } = useParams<SiteContentTypesDetailRouteParams>();
	const unmountedRef = useRef(false);
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
	const sitesActiveSorting = useMemo(() => parseStringToOrderBy(query.sort ?? ''), [query.sort]);
	const { pagination, loading: sitesLoading } = sitesConnector.hooks.usePaginatedSites(
		query as any
	);
	const paginatedSites = pagination?.data || [];
	const [paginatedSitesView, dispatch] = useReducer(paginatedSitesReducer, []);
	const siteIds = useMemo(() => {
		if (paginatedSitesView.length === 0) {
			return;
		}
		return paginatedSitesView.map(siteData => siteData.uuid);
	}, [paginatedSitesView]);
	const [, sitesDetailUIMap] = sitesConnector.hooks.useSitesUIStates(siteIds);

	useEffect(() => {
		if (paginatedSites.length > 0) {
			dispatch({
				type: PaginatedSitesActionTypes.SET,
				payload: paginatedSites,
			});
		}
	}, [paginatedSites]);

	useEffect(() => {
		return () => {
			unmountedRef.current = true;
		};
	}, []);

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

	const getOgSite = (siteUuid: string): SiteListModel | undefined => {
		if (!paginatedSitesView) {
			return;
		}

		return paginatedSitesView.find((s: SiteListModel) => s.uuid === siteUuid);
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

		sitesConnector.sitesFacade.updateSite(payload).then(() => {
			// Only update when component still exist
			if (unmountedRef.current) {
				return;
			}
			dispatch({
				type: PaginatedSitesActionTypes.UPDATE,
				payload,
			});
		});
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

		sitesConnector.sitesFacade.updateSite(payload).then(() => {
			// Only update when component still exist
			if (unmountedRef.current) {
				return;
			}
			dispatch({
				type: PaginatedSitesActionTypes.UPDATE,
				payload,
			});
		});
	};

	const RenderSitesTable = (): React.ReactElement | null => {
		const sitesRows: SitesOverviewRowData[] = paginatedSitesView.map(site => ({
			id: site.uuid,
			name: site.data.name,
			description: site.data.description,
			active: site.meta.active,
			contentTypes: site.data?.contentTypes,
			contentItems: site.meta?.contentItemsCount ?? 0,
			isUpdating: !!sitesDetailUIMap && !!sitesDetailUIMap[site.uuid]?.isUpdating,
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
				component(value, { contentItems, contentTypes, id, isUpdating }) {
					const isActive = (contentTypes || []).includes(contentType._id);

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
					currentPage={pagination?.currentPage}
					itemsPerPage={query.pagesize}
					onPageChange={handlePageChange}
					orderBy={handleOrderBy}
					noDataMessage="Er zijn geen resultaten voor de ingestelde filters"
					loadDataMessage="Sites ophalen"
					activeSorting={sitesActiveSorting}
					totalValues={pagination?.total ?? 0}
					loading={sitesLoading}
				/>
			</>
		);
	};

	return RenderSitesTable();
};

export default ContentTypeSites;
