import { Tab, TabTypes } from '../../../contentTypes.types';

export const SITE_CT_DETAIL_TABS: Tab[] = [
	{
		name: 'Instellingen',
		target: 'instellingen',
		type: TabTypes.INTERNAL,
		active: true,
	},
	{
		name: 'Content Componenten',
		target: 'content-componenten',
		type: TabTypes.INTERNAL,
		active: false,
		disabled: true,
	},
	{
		name: 'Navigatie',
		target: 'navigatie',
		type: TabTypes.INTERNAL,
		active: false,
		disabled: true,
	},
];
