import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';

import { ContentTypeSchema } from '../../services/contentTypes';

export interface ContentTypesCCNewProps extends RouteConfigComponentProps {
	contentType: ContentTypeSchema;
	routes: ModuleRouteConfig[];
	onSubmit: (data: any) => void;
}
