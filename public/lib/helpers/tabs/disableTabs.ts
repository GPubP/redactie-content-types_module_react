import { Tab } from '../../contentTypes.types';
import { ExternalTabModel } from '../../store/api/externalTabs';

export const disableTabs = (tabs: (ExternalTabModel | Tab)[]): (ExternalTabModel | Tab)[] =>
	tabs.map(tab => ({ ...tab, disabled: true }));
