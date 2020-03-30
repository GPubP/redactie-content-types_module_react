import { ModuleRouteConfig } from '@redactie/redactie-core';

export interface ContentTypesRouteProps {
	basePath: string;
	routes: ModuleRouteConfig[];
}

export interface ContentTypeSchema {
	uuid: string;
	meta: {
		label: string;
		description: string;
		status: string;
		createdAt: string;
		lastModified: string;
	};
}

export interface ContentTypesSchema {
	data: ContentTypeSchema[];
}
