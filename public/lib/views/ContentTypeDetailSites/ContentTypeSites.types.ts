import { RouteConfigComponentProps } from '@redactie/redactie-core';

import { ContentTypeSchema } from '../../services/contentTypes';
import { FieldTypesSchema } from '../../services/fieldTypes';

export interface ContenTypeDetailSitesProps extends RouteConfigComponentProps {
	contentType: ContentTypeSchema;
	fieldTypes: FieldTypesSchema;
	onSubmit: (contentType: ContentTypeSchema) => void;
}

export interface SitesRowData {
	uuid: string;
	name: string;
	description: string;
	status: boolean;
	contentTypes: string[];
	contentItems: number;
}
