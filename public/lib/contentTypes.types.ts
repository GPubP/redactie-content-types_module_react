import { FormsAPI } from '@redactie/form-renderer-module';
import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';
import { AlertProps } from '@redactie/utils';
import { FormikConfig, FormikValues } from 'formik';
import { ReactNode } from 'react';
import { NavLinkProps } from 'react-router-dom';

import { registerCTDetailTab } from './api/registerCTDetailTab';
import { ALERT_CONTAINER_IDS } from './contentTypes.const';
import { UseActiveFieldType } from './hooks/useActiveFieldType/useActiveFieldType.types';
import { UseActivePreset } from './hooks/useActivePreset/useActivePreset.types';
import { UseFieldTypes } from './hooks/useFieldTypes/useFieldTypes.types';
import { UseFieldTypesUIStates } from './hooks/useFieldTypesUIStates/useFieldTypesUIStates.types';
import { UsePaginatedPresets } from './hooks/usePaginatedPresets/usePaginatedPresets.types';
import { UsePresets } from './hooks/usePresets/usePresets.types';
import { UsePresetsUIStates } from './hooks/usePresetsUIStates/usePresetsUIStates.types';
import { Field } from './services/contentTypes';
import { FieldType, FieldTypeMeta, FieldTypesApiService } from './services/fieldTypes';
import { Preset, PresetDetail, PresetsApiService } from './services/presets';
import {
	ContentTypeDetailModel,
	ContentTypeFieldDetailModel,
	FieldsByCompartment,
} from './store/contentTypes';
import { DynamicFieldDetailModel } from './store/dynamicField/dynamicField.model';
import { FieldTypesFacade } from './store/fieldTypes';
import { PresetsFacade } from './store/presets';
import {
	ContentTypesCCConfig,
	ContentTypesCCSettings,
	ContentTypesCCValidation,
	ExternalTabValue,
} from './views/tenant';

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
	readonly dynamicFieldSettingsContext?: {
		dynamicField: DynamicFieldDetailModel;
		getCreatePath: (isPreset: boolean, fieldTypeUuid: string) => string;
		getEditPath: (uuid: string) => string;
		setDynamicField: (field: Field) => void;
	};
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
	uuid: string;
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

export interface ContentTypeAPI {
	registerCTDetailTab: typeof registerCTDetailTab;
	parseFields: FormsAPI['parseFields'];
	store: {
		presets: {
			service: PresetsApiService;
			facade: PresetsFacade;
		};
		fieldTypes: {
			service: FieldTypesApiService;
			facade: FieldTypesFacade;
		};
	};
	hooks: {
		// Presets
		useActivePreset: UseActivePreset;
		usePaginatedPresets: UsePaginatedPresets;
		usePresets: UsePresets;
		usePresetsUIStates: UsePresetsUIStates;
		// Field types
		useActiveFieldType: UseActiveFieldType;
		useFieldTypes: UseFieldTypes;
		useFieldTypesUIStates: UseFieldTypesUIStates;
	};
	views: {
		tenant: {
			ContentTypesCCConfig: typeof ContentTypesCCConfig;
			ContentTypesCCSettings: typeof ContentTypesCCSettings;
			ContentTypesCCValidation: typeof ContentTypesCCValidation;
		};
	};
}

export type AlertMessages<T extends string | number | symbol> = Record<
	T,
	{ [key in 'success' | 'error']?: AlertProps }
>;
