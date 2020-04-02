import { Tab } from './types';

export const BREADCRUMB_OPTIONS = {
	excludePaths: ['/', '/:tenantId'],
};

export const CONTENT_DETAIL_TABS: Tab[] = [
	{
		name: 'Instellingen',
		target: 'instellingen',
		active: true,
	},
	{
		name: 'Content Componenten',
		target: 'content-componenten',
		active: false,
	},
	{
		name: 'Sites',
		target: 'sites',
		active: false,
	},
];
