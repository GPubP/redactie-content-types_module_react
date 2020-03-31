import { ModuleRouteConfig } from '@redactie/redactie-core';

export interface ContentTypesRouteProps {
	basePath: string;
	routes: ModuleRouteConfig[];
}

export interface Operator {
	label: string;
	value: string;
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
	_embedded: ContentTypeSchema[];
}

export interface FieldTypeSchemaData {
	label: string;
	name: string;
	componentName: string;
	validators: string[];
	defaultValidatorValues: any[];
	defaultConfig: any;
	formSchema: {
		fields: any[];
	};
	dataType: string;
	generalConfig: {
		isQueryable: boolean;
		isTranslate: boolean;
		isMultiple: boolean;
	};
	operators: Operator[];
}

export interface FieldTypeSchemaMeta {
	created: string;
	lastModified: string;
	lastEditor: string;
	deleted: boolean;
}

export interface FieldTypeSchema {
	uuid: string;
	data: FieldTypeSchemaData;
	meta: FieldTypeSchemaMeta;
}

export interface FieldTypesSchema {
	_embedded: FieldTypeSchema[];
}
