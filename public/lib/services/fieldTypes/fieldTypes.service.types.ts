export interface Operator {
	label: string;
	value: string;
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

export type FieldTypesSchema = FieldTypeSchema[];
