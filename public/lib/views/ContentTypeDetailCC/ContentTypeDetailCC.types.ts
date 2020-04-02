import { RouteConfigComponentProps } from '@redactie/redactie-core';

import { ContentTypeSchema } from '../../services/contentTypes';
import { FieldTypesSchema } from '../../services/fieldTypes';

export interface ContenTypeDetailCCProps extends RouteConfigComponentProps {
	contentType: ContentTypeSchema;
	fieldTypes: FieldTypesSchema;
	tenantId: string;
	onSubmit: (contentType: ContentTypeSchema) => void;
}

export interface ContentTypeDetailCCRow {
	label: string;
	name: string;
	fieldType: string;
	multiple: boolean;
	required: boolean;
	translatable: boolean;
	hidden: boolean;
}
