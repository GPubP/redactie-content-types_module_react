import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';

export interface ContentTypesRouteProps extends RouteConfigComponentProps {
	basePath: string;
	routes: ModuleRouteConfig[];
	tenantId: string;
}
