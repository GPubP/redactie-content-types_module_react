import { DataType, FieldType, Operator } from '../fieldTypes';

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
export interface ContentTypeMeta {
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

export interface ContentTypeFieldDetail extends BaseContentTypeField {
	dataType: DataType;
	fieldType: FieldType;
}
export interface ContentTypeField extends BaseContentTypeField {
	dataType: string;
	fieldType: string;
}

/**
 * =========================
 * Response types
 * - Define all response interfaces coming from the server
 * =========================
 */

export interface ContentTypeBase<T> {
	_id: string;
	uuid?: string;
	fields: T[];
	modulesConfig: ModuleSettings[];
	meta: ContentTypeMeta;
}

export type ContentTypeResponse = ContentTypeBase<ContentTypeField>;

export type ContentTypeDetailResponse = ContentTypeBase<ContentTypeFieldDetail>;

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

export type ContentTypeUpdateRequest = ContentTypeBase<ContentTypeFieldDetail>;

export interface ContentTypeCreateRequest {
	fields: ContentTypeField[];
	modulesConfig: ModuleSettings[];
	meta: {
		label: string;
		description: string;
		safeLabel: string;
		// TODO: fix in backend that this isn't needed
		deleted: boolean;
	};
}
