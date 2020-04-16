import { BaseContentTypeField } from '../../services/contentTypes';
import { FieldTypeSchemaData, FieldTypeSchemaMeta } from '../../services/fieldTypes';

export interface ContentTypeField extends BaseContentTypeField {
	dataType: string;
	defaultValue?: string;
	fieldType: {
		_id?: string;
		uuid?: string;
		data: FieldTypeSchemaData;
		meta?: FieldTypeSchemaMeta;
	};
}

export interface InternalState {
	readonly activeField: ContentTypeField | null;
	readonly fields: ContentTypeField[];
}
