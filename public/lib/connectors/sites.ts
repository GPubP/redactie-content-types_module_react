import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import { Routes } from '@redactie/redactie-core/dist/routes';

// TODO export sites api typings
const SitesAPI: { routes: Routes } = Core.modules.getModuleAPI('sites-module') as {
	routes: Routes;
};

export const registerRoutes = (routes: ModuleRouteConfig): any | false =>
	SitesAPI ? SitesAPI.routes.register(routes) : false;
