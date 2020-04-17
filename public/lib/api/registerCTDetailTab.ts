import { ExternalTabOptions, externalTabsService } from '../store/api/externalTabs';

export const registerCTDetailTab = (name: string, options: ExternalTabOptions): void =>
	externalTabsService.registerTabs(name, options);
