import { Tab, TabTypes } from '../../contentTypes.types';
import { ExternalTabModel } from '../../store/api/externalTabs';

export const mapExternalTabToTab = (externalTab: ExternalTabModel): Tab => ({
	target: externalTab.name,
	name: externalTab.label,
	id: externalTab.name,
	type: TabTypes.EXTERNAL,
	active: true,
});
