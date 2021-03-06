import { Field, Validation } from '../contentTypes';

/**
 * =========================
 * Base types
 * =========================
 */

export interface Operator {
	label: string;
	value: string;
}

export interface DataType {
	_id: string;
	meta: {
		createdAt: string;
		deleted: boolean;
		lastModified: string;
		created: string;
	};
	data: {
		label: string;
		type: string;
		semanticType: string;
	};
	uuid: string;
}

export interface MapValueToContentItemPath {
	type: 'BE';
	sourcePath: string[];
	destPath: string[];
}

export interface FieldTypeData {
	label: string;
	name: string;
	componentName: string;
	validators: any[];
	defaultValidatorValues: Validation;
	defaultConfig: any;
	fieldType?: string;
	formSchema: {
		fields: Field[];
	};
	dataType: DataType;
	generalConfig: {
		isQueryable: boolean;
		isTranslatable: boolean;
		defaultTranslateValue: boolean;
		isMultiple: boolean;
		defaultLabel?: string;
		defaultGuideline?: string;
		allowDefault: boolean;
		removable?: false;
		mapValueToContentItemPath?: MapValueToContentItemPath[];
	};
	operators: Operator[];
	module: string;
}

export interface FieldTypeMeta {
	created: string;
	lastModified: string;
	lastEditor: string;
	deleted: boolean;
}

export interface FieldType {
	_id: string;
	uuid: string;
	data: FieldTypeData;
	meta: FieldTypeMeta;
	validateSchema: {
		configuration: object;
		validation: {
			formSchema: object;
			dataSchema: object;
		};
	};
	errorMessages: {
		configuration: Record<string, string>;
		validation: {
			formSchema: Record<string, string>;
			dataSchema: Record<string, string>;
		};
	};
}

/**
 * =========================
 * Response types
 * - Define all response interfaces coming from the server
 * =========================
 */

export type FieldTypesResponse = {
	data: FieldType[];
};
