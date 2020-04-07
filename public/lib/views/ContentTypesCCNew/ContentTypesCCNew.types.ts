import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';

import { ContentTypeSchema } from '../../services/contentTypes';
import { Tab } from '../../types';

export interface ContentTypesCCNewProps extends RouteConfigComponentProps {
	contentType: ContentTypeSchema;
	routes: ModuleRouteConfig[];
	onSubmit: (data: any, tab: Tab) => void;
}
