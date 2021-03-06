import { ALERT_CONTAINER_IDS } from '../../../contentTypes.const';
import { Tab, TabTypes } from '../../../contentTypes.types';

export const SITE_CT_DETAIL_TABS: Tab[] = [
	{
		name: 'Instellingen',
		target: 'instellingen',
		type: TabTypes.INTERNAL,
		active: true,
		disabled: false,
		containerId: ALERT_CONTAINER_IDS.detailSettings,
	},
	{
		name: 'Content componenten',
		target: 'content-componenten',
		type: TabTypes.INTERNAL,
		active: false,
		disabled: true,
		containerId: ALERT_CONTAINER_IDS.detailCC,
	},
];
