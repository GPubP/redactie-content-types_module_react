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

export interface FieldTypeData {
	label: string;
	name: string;
	componentName: string;
	validators: any[];
	defaultValidatorValues: any[];
	defaultConfig: any;
	formSchema: {
		fields: any[];
	};
	dataType: DataType;
	generalConfig: {
		isQueryable: boolean;
		isTranslate: boolean;
		isMultiple: boolean;
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
