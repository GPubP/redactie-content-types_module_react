import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';

import { ContentTypeFieldSchema, ContentTypeSchema } from './services/contentTypes';
import { FieldTypeSchema, FieldTypeSchemaData, FieldTypeSchemaMeta } from './services/fieldTypes';
import { ContentTypeField, InternalState } from './store/internal';
import { Tab } from './types';
import { ExternalTabValue } from './views/ContentTypeDetailExternal/ContentTypeDetailExternal.types';

export interface ContentTypesModuleProps extends RouteConfigComponentProps {
	routes: ModuleRouteConfig[];
	tenantId: string;
}

export interface FilterFormState {
	name: string;
}
export interface ContentTypesRouteProps<Params = {}> extends RouteConfigComponentProps<Params> {
	routes: ModuleRouteConfig[];
}

export interface ContentTypesDetailRouteProps<Params = { contentTypeUuid: string }>
	extends RouteConfigComponentProps<Params> {
	fieldTypes: FieldTypeSchema[];
	contentType: ContentTypeSchema;
	onCancel: () => void;
	onSubmit: (
		data: ContentTypeSchema | ContentTypeFieldSchema[] | FieldTypeSchemaMeta | ExternalTabValue,
		tab: Tab
	) => void;
	routes: ModuleRouteConfig[];
	state: InternalState;
}

export interface ContentTypesCCRouteProps extends ContentTypesRouteProps {
	CTField: ContentTypeField;
	fieldTypeData: FieldTypeSchemaData;
	onDelete?: () => void;
	onSubmit: (data: any) => void;
}

export interface NewCCFormState {
	fieldType: string;
	name: string;
}

export interface CCSettingsFormState {
	label: string;
	name: string;
	defaultValue: string;
	config: {
		guideline: string;
	};
	generalConfig: {
		required: boolean;
		hidden: boolean;
		min: number;
		max: number;
	};
}
