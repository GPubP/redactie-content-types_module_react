import { Breadcrumb, ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import { ReactNode } from 'react';

import { BREADCRUMB_OPTIONS, MODULE_PATHS } from '../../contentTypes.const';
import { useNavigate } from '../../hooks';
import useRoutes from '../useRoutes/useRoutes';

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
