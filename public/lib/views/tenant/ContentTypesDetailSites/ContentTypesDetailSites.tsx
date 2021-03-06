import { PaginatedTable } from '@acpaas-ui/react-editorial-components';
import { SiteListModel, UpdateSitePayload } from '@redactie/sites-module';
import {
	AlertContainer,
	OrderBy,
	parseOrderByToString,
	parseStringToOrderBy,
	SearchParams,
	useAPIQueryParams,
} from '@redactie/utils';
import React, { FC, useEffect, useMemo, useReducer, useRef } from 'react';
import { useParams } from 'react-router-dom';

import sitesConnector from '../../../connectors/sites';
import {
	CORE_TRANSLATIONS,
	useCoreTranslation,
	useModuleTranslation,
} from '../../../connectors/translations';
import { ALERT_CONTAINER_IDS } from '../../../contentTypes.const';
import {
	ContentTypesDetailRouteProps,
	SiteContentTypesDetailRouteParams,
} from '../../../contentTypes.types';
import { MODULE_TRANSLATIONS } from '../../../i18next/translations.const';

import { DETAIL_SITES_COLUMNS } from './ContentTypesDetailSites.const';
import {
	PaginatedSitesActionTypes,
	paginatedSitesReducer,
} from './ContentTypesDetailSites.reducer';
import { SitesOverviewRowData } from './ContentTypesSites.types';

const ContentTypeSites: FC<ContentTypesDetailRouteProps> = ({ contentType }) => {
	const [t] = useCoreTranslation();
	const [tModule] = useModuleTranslation();
	const { contentTypeUuid, ctType } = useParams<SiteContentTypesDetailRouteParams>();
	const unmountedRef = useRef(false);
	const [query, setQuery] = useAPIQueryParams({
		sort: {
			type: 'string',
		},
		'content-type': {
			defaultValue: contentTypeUuid,
			type: 'string',
		},
	});
	const sitesActiveSorting = useMemo(() => parseStringToOrderBy(query.sort ?? ''), [query.sort]);
	const { pagination, loading: sitesLoading } = sitesConnector.hooks.usePaginatedSites(
		query as SearchParams
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
	const TYPE_TRANSLATIONS = MODULE_TRANSLATIONS[ctType];

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

		const sitesColumns = DETAIL_SITES_COLUMNS(
			t,
			contentType._id,
			removeCTsFromSites,
			setCTsOnSites
		);

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
				<p className="u-margin-bottom">{tModule(TYPE_TRANSLATIONS.SITES_INTRO)}</p>
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
					noDataMessage={t(CORE_TRANSLATIONS['TABLE_NO-ITEMS'])}
					loadDataMessage="Sites ophalen"
					activeSorting={sitesActiveSorting}
					totalValues={pagination?.total ?? 0}
					loading={sitesLoading}
					hideResultsMessage
				/>
			</>
		);
	};

	return RenderSitesTable();
};

export default ContentTypeSites;
