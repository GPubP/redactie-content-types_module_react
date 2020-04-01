import { ContentTypeSchema, FieldTypesSchema } from '../../content-types.types';

export interface ContenTypeCCProps {
	basePath: string;
	contentType: ContentTypeSchema;
	fieldTypes: FieldTypesSchema;
	onSubmit: (contentType: ContentTypeSchema) => void;
}

export interface ContentTypeRow {
	name: string;
	contentItems: number;
	description: string;
	status: string;
}
