import { Tab } from '../../contentTypes.types';
import { ExternalTabModel } from '../../store/api/externalTabs';

export const disableTabs = (
	tabs: (ExternalTabModel | Tab)[],
	context: Record<string, any>
): (ExternalTabModel | Tab)[] =>
	tabs.map(tab => ({
		...tab,
		disabled:
			tab.disabled instanceof Function
				? tab.disabled(context)
				: tab.disabled !== undefined
				? tab.disabled
				: true,
	}));
