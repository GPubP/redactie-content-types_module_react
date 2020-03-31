import { ContentTypeSchema, FieldTypesSchema } from '../../content-types.types';

export interface ContenTypeCCProps {
	contentType: ContentTypeSchema;
	fieldTypes: FieldTypesSchema;
	onSubmit: (contentType: ContentTypeSchema) => void;
}

export interface ContentTypeRow {
	label: string;
	name: string;
	fieldType: string;
	multiple: boolean;
	required: boolean;
	translatable: boolean;
	hidden: boolean;
}
