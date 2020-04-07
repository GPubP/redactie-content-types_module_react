import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';

import { FieldTypeSchemaData } from './services/fieldTypes';

export interface ContentTypesRouteProps extends RouteConfigComponentProps {
	basePath: string;
	routes: ModuleRouteConfig[];
	tenantId: string;
}

export interface ContentTypesCCNewRouteProps extends ContentTypesRouteProps {
	fieldTypeData: FieldTypeSchemaData;
	onSubmit: (data: any) => void;
}

export interface CCSettingsFormState<IsMultiple = boolean | string> {
	label: string;
	name: string;
	componentName: string;
	dataType: string;
	generalConfig: {
		isQueryable: boolean;
		isTranslate: boolean;
		isMultiple: IsMultiple; // Radio button value is returned as string
	};
}
