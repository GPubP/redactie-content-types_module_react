import { ModuleRouteConfig } from '@redactie/redactie-core';

export interface ContentTypesRouteProps {
	basePath: string;
	routes: ModuleRouteConfig[];
}

export interface ContentTypeSettingsFormState {
	name: string;
	description: string;
}

export interface ContentTypeSchema {
	uuid: string;
	data: {
		name: string;
		description: string;
		status: string;
	};
	meta: {
		tenant: string;
		createdAt: string;
		updatedAt: string;
	};
}

export interface ContentTypesSchema {
	_embedded: ContentTypeSchema[];
}
