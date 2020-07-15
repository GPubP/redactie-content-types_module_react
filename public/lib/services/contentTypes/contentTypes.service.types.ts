import { DataType, FieldType, Operator } from '../fieldTypes';
import { Preset, PresetDetail } from '../presets';

/**
 * =========================
 * Base types
 * =========================
 */

export interface ValidationCheck {
	key: string;
	val: unknown;
	err: string;
}

export interface ValicationCheckWithFields {
	type: string;
	fields: ValidationCheckField[];
}

export interface ValidationCheckField {
	name: string;
	type: string;
	checks: ValidationCheck[];
}

export interface Validation {
	type: string;
	checks: ValidationCheck[] | ValicationCheckWithFields[];
}

export type ValidationSchema = Record<string, any>;

export interface Field<D = DataType, F = FieldType, P = Preset | PresetDetail> {
	uuid?: string;
	label: string;
	module: string;
	name: string;
	config: {
		fields?: Field[];
		[key: string]: any;
	};
	defaultValue?: any;
	validators: string[];
	operators: Operator[];
	validation?: Validation;
	generalConfig: {
		multiLanguage?: boolean;
		required?: boolean;
		hidden?: boolean;
		min?: number;
		max?: number;
	};
	dataType: D;
	fieldType: F;
	preset?: P;
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

export type ContentTypeFieldDetail = Field;
export type ContentTypeField = Field<string, string, string>;

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
