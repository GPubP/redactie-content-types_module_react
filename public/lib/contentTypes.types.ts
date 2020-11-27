import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';
import { FormikConfig, FormikValues } from 'formik';
import { ReactNode } from 'react';
import { NavLinkProps } from 'react-router-dom';

import { ALERT_CONTAINER_IDS } from './contentTypes.const';
import { FieldType, FieldTypeMeta } from './services/fieldTypes';
import { Preset, PresetDetail } from './services/presets';
import {
	ContentTypeDetailModel,
	ContentTypeFieldDetailModel,
	FieldsByCompartment,
} from './store/contentTypes';
import { ExternalTabValue } from './views/tenant/ContentTypesDetailExternal';

export interface ContentTypesModuleProps<Params extends { [K in keyof Params]?: string } = {}>
	extends RouteConfigComponentProps<Params> {
	routes: ModuleRouteConfig[];
	tenantId: string;
}

export interface ContentTypesRouteParams {
	contentTypeUuid: string;
}

export interface ContentTypesRouteProps<Params = ContentTypesRouteParams>
	extends RouteConfigComponentProps<Params> {
	routes: ModuleRouteConfig[];
}

export interface SiteContentTypesDetailRouteParams {
	siteId: string;
	contentTypeUuid: string;
}

export interface ContentTypesDetailRouteParams {
	contentTypeUuid: string;
	contentComponentUuid: string;
}

export interface ContentTypesDetailRouteProps<Params = ContentTypesDetailRouteParams>
	extends RouteConfigComponentProps<Params> {
	readonly allowedPaths?: string[];
	readonly presets: Preset[];
	readonly fieldTypes: FieldType[];
	readonly contentType: ContentTypeDetailModel;
	readonly fieldsByCompartments: FieldsByCompartment[];
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
	readonly fieldsHaveChanged: boolean;
}

export interface ContentTypesCCRouteProps extends ContentTypesRouteProps {
	readonly CTField: ContentTypeFieldDetailModel;
	readonly fieldType: FieldType;
	readonly preset?: PresetDetail;
	onDelete?: () => void;
	onSubmit: (data: any) => void;
	formikRef: FormikRef;
}

export interface NewCCFormState {
	fieldType: string;
	name: string;
	compartment?: string;
}

export interface CCSettingsFormState {
	label: string;
	name: string;
	defaultValue: string;
	generalConfig: {
		guideline: string;
		required: boolean;
		hidden: boolean;
		disabled: boolean;
		min: number;
		max: number;
	};
}

export interface NavListItem extends NavLinkProps {
	description?: string;
	filter?: (values: any) => boolean;
	hasError?: boolean;
	label: string;
}

export interface Tab {
	id?: string;
	name: string;
	target: string;
	active: boolean;
	type: TabTypes;
	disabled?: boolean;
	containerId: ALERT_CONTAINER_IDS;
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

export type FormikRef = FormikConfig<FormikValues>['innerRef'];

export interface TableColumn<RowData = unknown> {
	label: string;
	value?: string;
	component?: (value: any, rowData: RowData, rowIndex: number) => ReactNode;
	headerComponent?: (value: any) => ReactNode;
	format?: (value: any, col: TableColumn<RowData>, rowData: RowData, rowIndex: number) => string;
	hidden?: boolean;
	disabled?: boolean;
	disableSorting?: boolean;
	classList?: string[];
	fallback?: string;
}
