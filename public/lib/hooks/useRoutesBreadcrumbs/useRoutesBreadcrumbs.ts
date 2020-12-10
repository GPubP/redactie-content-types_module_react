import { Breadcrumb, ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import { useNavigate, useRoutes } from '@redactie/utils';
import { ReactNode } from 'react';

import { BREADCRUMB_OPTIONS, MODULE_PATHS } from '../../contentTypes.const';

const useRoutesBreadcrumbs = (
	extraBreadcrumbs: Breadcrumb[] = [],
	excludePaths: string[] = []
): ReactNode => {
	const { generatePath } = useNavigate();
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], {
		...BREADCRUMB_OPTIONS,
		extraBreadcrumbs: [
			{
				name: 'Home',
				target: generatePath(MODULE_PATHS.dashboard),
			},
			{
				name: 'Structuur',
				target: '',
			},
			...extraBreadcrumbs,
		],
		excludePaths: [...BREADCRUMB_OPTIONS.excludePaths, ...excludePaths],
	});

	return breadcrumbs;
};

export default useRoutesBreadcrumbs;
