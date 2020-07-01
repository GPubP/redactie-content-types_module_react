import { DataTypeSchema, FieldTypeSchema, Operator } from '../fieldTypes';

/**
 * =========================
 * Base types
 * =========================
 */

export type ValidationSchema = Record<string, any>;
export interface BaseContentTypeField {
	uuid?: string;
	label: string;
	module: string;
	name: string;
	config: any;
	defaultValue?: any;
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
export interface ContentTypePaging {
	total: number;
	moreResults: boolean;
	limit: number;
	skip: number;
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
	canBeFiltered: boolean;
}
export interface ModuleSettings {
	uuid?: string;
	label: string;
	name: string;
	module?: string;
	config: Record<string, any>;
	validationSchema?: ValidationSchema;
}

/**
 * =========================
 * Response types
 * - Define all response interfaces coming from the server
 * =========================
 */
export interface ContentTypeFieldDetailResponse extends BaseContentTypeField {
	dataType: DataTypeSchema;
	fieldType: FieldTypeSchema;
}
export interface ContentTypeFieldResponse extends BaseContentTypeField {
	dataType: string;
	fieldType: string;
}

export interface ContentTypeBaseResponse<T> {
	_id: string;
	uuid: string;
	fields: T[];
	modulesConfig: ModuleSettings[];
	meta: ContentTypeMetaSchema;
}

export type ContentTypeResponse = ContentTypeBaseResponse<ContentTypeFieldResponse>;

export type ContentTypeDetailResponse = ContentTypeBaseResponse<ContentTypeFieldDetailResponse>;

export interface ContentTypesResponse {
	data: ContentTypeResponse[];
	paging: ContentTypePaging;
}

/**
 * =========================
 * Request types
 * - Define all request interfaces that are send to the server
 * =========================
 */
export interface ContentTypeFieldSchema extends BaseContentTypeField {
	dataType: string;
	fieldType: string;
}

export interface ContentTypeSchema {
	_id: string;
	uuid?: string;
	fields: ContentTypeFieldSchema[];
	modulesConfig: ModuleSettings[];
	meta: ContentTypeMetaSchema;
}

export interface ContentTypeUpdateRequest {
	_id: string;
	uuid?: string;
	fields: ContentTypeFieldDetailResponse[];
	modulesConfig: ModuleSettings[];
	meta: ContentTypeMetaSchema;
}

export interface ContentTypeCreateRequest {
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
