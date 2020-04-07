import { RouteConfigComponentProps } from '@redactie/redactie-core';

import { ContentTypeSchema } from '../../services/contentTypes';
import { FieldTypeSchema } from '../../services/fieldTypes';

export interface ContenTypeDetailCCProps extends RouteConfigComponentProps {
	contentType: ContentTypeSchema;
	fieldTypes: FieldTypeSchema[];
	tenantId: string;
	onSubmit: (contentType: ContentTypeSchema) => void;
}

export interface ContentTypeDetailCCRow {
	path: string;
	label: string;
	name: string;
	fieldType: string;
	multiple: boolean;
	required: boolean;
	translatable: boolean;
	hidden: boolean;
}
