import { useMemo } from 'react';

import { mapExternalTabToTab } from '../../helpers/mapExternalTabToTab/mapExternalTabToTab';
import { ExternalTabModel } from '../../store/api/externalTabs';
import { Tab } from '../../types';

const useActiveTabs = (tabs: Tab[], externalTabs: ExternalTabModel[], pathname: string): Tab[] => {
	const activeTabs = useMemo(() => {
		const externalMappedTabs = externalTabs.map(externalTab =>
			mapExternalTabToTab(externalTab)
		);

		return [...tabs, ...externalMappedTabs].map(tab => ({
			...tab,
			active: new RegExp(`/${tab.target}/?`).test(pathname),
		}));
	}, [externalTabs, pathname, tabs]);

	return activeTabs;
};

export default useActiveTabs;
