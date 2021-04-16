import { SiteListModel, SitesResponse } from '@redactie/sites-module';
import { LoadingState } from '@redactie/utils';
import { useEffect, useState } from 'react';

import sitesConnector from '../../connectors/sites';

const useSites: () => [LoadingState, SiteListModel[], () => Promise<void>] = () => {
	const [loading, setLoading] = useState(LoadingState.Loading);
	const [sites, setSites] = useState<SiteListModel[]>([]);

	const fetchSites = async (): Promise<void> => {
		setLoading(LoadingState.Loading);

		const result = await sitesConnector.sitesService
			.getSites({ page: 0, pagesize: -1 })
			.then((sitesResponse: SitesResponse) => {
				setLoading(LoadingState.Loaded);
				return sitesResponse._embedded;
			})
			.catch(() => {
				setLoading(LoadingState.Error);
				return [];
			});

		setSites(result);
	};

	useEffect(() => {
		fetchSites();
	}, []);

	return [loading, sites, fetchSites];
};

export default useSites;
