import { ISSUED_PUBLICATION_OPTIONS } from '../../contentTypes.const';
import { DataType, FieldType, Operator } from '../fieldTypes';
import { Preset, PresetDetailResponse, Validator } from '../presets';

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
	min?: number;
	max?: number;
	checks: ValidationCheck[];
}

export interface ValicationCheckWithAllowedFields {
	id?: string;
	type: string;
	allowedFields: ValidationCheckAllowedField[];
}

export interface ValidationCheckAllowedField {
	type: string;
	fieldType: string;
	checks: ValidationCheck[];
}

export interface Validation {
	type: string;
	checks: (ValidationCheck | ValicationCheckWithFields | ValicationCheckWithAllowedFields)[];
}

export type ValidationSchema = Record<string, any>;

export interface Field<D = DataType, F = FieldType, P = Preset | PresetDetailResponse> {
	uuid: string;
	label: string;
	module: string;
	name: string;
	config: {
		fields?: Field[];
		[key: string]: any;
	};
	defaultValue?: any;
	validators: Validator[];
	operators: Operator[];
	validation?: Validation;
	generalConfig: {
		guideline: string;
		multiLanguage?: boolean;
		required?: boolean;
		hidden?: boolean;
		disabled?: boolean;
		min?: number;
		max?: number;
		combinedOutput?: boolean;
		placeholder?: string;
	};
	dataType: D;
	fieldType: F;
	preset?: P;
	compartment: FieldCompartment;
	__new?: boolean;
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
	contentItemCount: number | undefined;
	deleted: false;
	status?: string;
	lastEditor: string;
	canBeFiltered: boolean;
	urlPath?: {
		pattern: string;
	};
	issuedOnPrefill?: ISSUED_PUBLICATION_OPTIONS;
	issuedOnEditable?: boolean;
}
export interface ModuleSettings {
	uuid?: string;
	label: string;
	name: string;
	module?: string;
	config: Record<string, any>;
	validationSchema?: ValidationSchema;
	site?: string;
}

export interface Compartment {
	uuid: string;
	label: string;
	removable: boolean;
}

export interface FieldCompartment {
	uuid: string;
	position: number;
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
	compartments: Compartment[];
}

export interface ContentTypeResponse extends ContentTypeBase<ContentTypeField> {
	uuid: string;
}

export interface ContentTypeDetailResponse extends ContentTypeBase<ContentTypeFieldDetail> {
	uuid: string;
}

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

export type ContentTypeUpdateRequest = ContentTypeDetailResponse;

export type ContentTypeWorkflowUpdateRequest = {
	from: string;
	to: string;
	mapping: {
		from: string;
		to: string;
	}[];
};

export interface ContentTypeCreateRequest {
	compartments: Compartment[];
	fields: ContentTypeField[];
	modulesConfig: ModuleSettings[];
	meta: {
		canBeFiltered: boolean;
		label: string;
		safeLabel: string;
		description: string;
		urlPath: { pattern: string };
		// TODO: fix in backend that this isn't needed
		deleted: boolean;
	};
}
