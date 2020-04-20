import { FieldTypeSchema, Operator } from '../fieldTypes';

export type ValidationSchema = Record<string, any>;

export interface ContentTypePaging {
	total: number;
	moreResults: boolean;
	limit: number;
	skip: number;
}

export interface ModuleSettings {
	uuid?: string;
	label: string;
	name: string;
	module?: string;
	config: Record<string, any>;
	validationSchema?: ValidationSchema;
}

export interface BaseContentTypeField {
	uuid?: string;
	label: string;
	module: string;
	name: string;
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

export interface ContentTypeFieldSchema extends BaseContentTypeField {
	dataType: string;
	fieldType: string;
}

export interface ContentTypeFieldResponse extends BaseContentTypeField {
	dataType: {
		_id: string;
		meta: {
			createdAt: string;
			deleted: boolean;
			lastModified: string;
		};
		data: {
			label: string;
			type: string;
			semanticType: string;
		};
		uuid: string;
	};
	fieldType: FieldTypeSchema;
}

export interface ContentTypeMetaSchema {
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
	uuid?: string;
	fields: ContentTypeFieldSchema[];
	modulesConfig: ModuleSettings[];
	meta: ContentTypeMetaSchema;
}
export interface ContentTypesDataSchema {
	data: ContentTypeSchema[];
}

export interface ContentTypeResponse {
	_id: string;
	uuid: string;
	fields: ContentTypeFieldResponse[];
	modulesConfig: ModuleSettings[];
	meta: ContentTypeMetaSchema;
}

export interface ContentTypesSchema {
	data: ContentTypeResponse[];
	paging: ContentTypePaging;
}

export interface ContentTypeCreate {
	fields: ContentTypeFieldSchema[];
	modulesConfig: ModuleSettings[];
	meta: {
		label: string;
		description: string;
		safeLabel: string;
		// TODO: fix in backend that this isn't needed
		deleted: boolean;
	};
}
