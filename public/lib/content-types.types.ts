import { ModuleRouteConfig } from '@redactie/redactie-core';

export interface ContentTypesRouteProps {
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
	operators: Array<{
		label: string;
		value: string;
	}>;
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
	_embedded: ContentTypeSchema[];
}
