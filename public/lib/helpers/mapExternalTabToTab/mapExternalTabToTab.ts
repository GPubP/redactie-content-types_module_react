import { ExternalTabModel } from '../../store/api/externalTabs';
import { Tab, TabTypes } from '../../types';

export const mapExternalTabToTab = (externalTab: ExternalTabModel): Tab => ({
	target: `./${externalTab.name}`,
	name: externalTab.label,
	type: TabTypes.EXTERNAL,
	active: true,
});
