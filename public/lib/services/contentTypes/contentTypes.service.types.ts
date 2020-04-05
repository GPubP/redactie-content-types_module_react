import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';

import { Operator } from '../fieldTypes';

export interface ContentTypesRouteProps extends RouteConfigComponentProps {
	basePath: string;
	routes: ModuleRouteConfig[];
}

export interface ContentTypeFieldSchema {
	uuid?: string;
	label: string;
	module: string;
	name: string;
	dataType: string;
	fieldType: string;
	config: any;
	validators: string[];
	operators: Operator[];
	generalConfig: {
		multiLanguage?: boolean;
		required?: boolean;
		hidden?: boolean;
		min?: number;
		max?: number;
	};
}

export interface ContenTypeMetaSchema {
	label: string;
	safeLabel: string;
	description: string;
	created: string;
	lastModified: string;
	taxonomy: {
		available: string[];
		fieldType: string;
		tags: string[];
	};
	deleted: false;
	status?: string;
	lastEditor: string;
}

export interface ContentTypeSchema {
	_id: string;
	uuid: string;
	fields: ContentTypeFieldSchema[];
	meta: ContenTypeMetaSchema;
}

export interface ContentTypesSchema {
	data: ContentTypeSchema[];
}
