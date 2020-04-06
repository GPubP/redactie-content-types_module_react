import { RouteConfigComponentProps } from '@redactie/redactie-core';

import { ContentTypeSchema } from '../../services/contentTypes';
import { FieldTypesSchema } from '../../services/fieldTypes';
import { Tab } from '../../types';

export interface ContenTypeDetailSettingsProps extends RouteConfigComponentProps {
	contentType: ContentTypeSchema;
	fieldTypes: FieldTypesSchema;
	tenantId: string;
	onSubmit: (sectionData: any, tab: Tab) => void;
}
