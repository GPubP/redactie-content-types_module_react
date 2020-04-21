export interface Operator {
	label: string;
	value: string;
}

export interface DataTypeSchema {
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

export interface FieldTypeSchemaData {
	label: string;
	name: string;
	componentName: string;
	validators: any[];
	defaultValidatorValues: any[];
	defaultConfig: any;
	formSchema: {
		fields: any[];
	};
	dataType: DataTypeSchema;
	generalConfig: {
		isQueryable: boolean;
		isTranslate: boolean;
		isMultiple: boolean;
	};
	operators: Operator[];
	module: string;
}

export interface FieldTypeSchemaMeta {
	created: string;
	lastModified: string;
	lastEditor: string;
	deleted: boolean;
}

export interface FieldTypeSchema {
	_id: string;
	uuid: string;
	data: FieldTypeSchemaData;
	meta: FieldTypeSchemaMeta;
}

export type FieldTypesSchema = {
	data: FieldTypeSchema[];
};
