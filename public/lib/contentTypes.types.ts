import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';

import { FieldType, FieldTypeData, FieldTypeMeta } from './services/fieldTypes';
import { Preset, PresetDetail } from './services/presets';
import { ContentTypeDetailModel, ContentTypeFieldDetailModel } from './store/contentTypes';
import { ExternalTabValue } from './views/ContentTypeDetailExternal/ContentTypeDetailExternal.types';

export interface ContentTypesModuleProps extends RouteConfigComponentProps {
	routes: ModuleRouteConfig[];
	tenantId: string;
}

export interface ContentTypesRouteProps<Params = { contentTypeUuid: string }>
	extends RouteConfigComponentProps<Params> {
	routes: ModuleRouteConfig[];
}

export interface ContentTypesDetailRouteProps<
	Params = { contentTypeUuid: string; contentComponentUuid: string }
> extends RouteConfigComponentProps<Params> {
	readonly presets: Preset[];
	readonly fieldTypes: FieldType[];
	readonly contentType: ContentTypeDetailModel;
	onCancel: () => void;
	onSubmit: (
		data:
			| ContentTypeDetailModel
			| ContentTypeFieldDetailModel[]
			| FieldTypeMeta
			| ExternalTabValue,
		tab: Tab
	) => void;
	readonly activeField: ContentTypeFieldDetailModel | null;
}

export interface ContentTypesCCRouteProps extends ContentTypesRouteProps {
	readonly CTField: ContentTypeFieldDetailModel;
	readonly fieldTypeData: FieldTypeData;
	readonly preset?: PresetDetail;
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
	generalConfig: {
		guideline: string;
		required: boolean;
		hidden: boolean;
		min: number;
		max: number;
	};
}

export interface Tab {
	id?: string;
	name: string;
	target: string;
	active: boolean;
	type: TabTypes;
	disabled?: boolean;
}

export enum TabTypes {
	'INTERNAL',
	'EXTERNAL',
}

export enum LoadingState {
	Loading = 'loading',
	Loaded = 'loaded',
	Error = 'error',
}
