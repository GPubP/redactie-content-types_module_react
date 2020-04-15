import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';
import { Dispatch } from 'react';

import { ContentTypeFieldSchema, ContentTypeSchema } from './services/contentTypes';
import { FieldTypeSchema, FieldTypeSchemaData, FieldTypeSchemaMeta } from './services/fieldTypes';
import { Tab } from './types';
import {
	ContentTypeUpdateAction,
	ContentTypeUpdateState,
} from './views/ContentTypeUpdate/ContentTypeUpdate.types';

export interface ContentTypesModuleProps extends RouteConfigComponentProps {
	basePath: string;
	routes: ModuleRouteConfig[];
	tenantId: string;
}

export interface ContentTypesRouteProps<Params = {}> extends RouteConfigComponentProps<Params> {
	basePath: string;
	routes: ModuleRouteConfig[];
}

export interface ContentTypesDetailRouteProps<Params = {}>
	extends RouteConfigComponentProps<Params> {
	fieldTypes: FieldTypeSchema[];
	contentType: ContentTypeSchema;
	state: ContentTypeUpdateState;
	dispatch: Dispatch<ContentTypeUpdateAction>;
	onCancel: () => void;
	onSubmit: (
		data: ContentTypeSchema | ContentTypeFieldSchema[] | FieldTypeSchemaMeta,
		tab: Tab
	) => void;
	routes: ModuleRouteConfig[];
}

export interface ContentTypesCCRouteProps extends ContentTypesRouteProps {
	CTField: ContentTypeFieldSchema;
	contentType?: ContentTypeSchema;
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
