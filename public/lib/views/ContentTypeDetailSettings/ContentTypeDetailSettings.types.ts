import { RouteConfigComponentProps } from '@redactie/redactie-core';

import { ContentTypeSchema } from '../../services/contentTypes';
import { FieldTypesSchema } from '../../services/fieldTypes';

export interface ContenTypeDetailSettingsProps extends RouteConfigComponentProps {
	contentType: ContentTypeSchema;
	fieldTypes: FieldTypesSchema;
	tenantId: string;
	onSubmit: (contentType: ContentTypeSchema) => void;
}
