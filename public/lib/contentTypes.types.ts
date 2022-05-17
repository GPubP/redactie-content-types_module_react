import { FormsAPI } from '@redactie/form-renderer-module';
import { LanguagesSchema } from '@redactie/language-module';
import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';
import { AlertProps, ContextHeaderTab, FilterItem } from '@redactie/utils';
import { FormikConfig, FormikValues } from 'formik';

import { registerCTDetailTab } from './api/registerCTDetailTab';
import { ALERT_CONTAINER_IDS } from './contentTypes.const';
import {
	configurationCompartmentValidator,
	createInitialValuesFromChecks,
	defaultValueCompartmentValidator,
	generateConfig,
	generateConfigFromValidationData,
	generateFormSchemaFromFieldTypeData,
	generateFormSchemaFromPreset,
	generateValidationChecks,
	settingsCompartmentValidator,
	validationCompartmentValidator,
} from './helpers';
import { UseActiveFieldType } from './hooks/useActiveFieldType/useActiveFieldType.types';
import { UseActivePreset } from './hooks/useActivePreset/useActivePreset.types';
import { UseContentType } from './hooks/useContentType/useContentType.types';
import { UseFieldType } from './hooks/useFieldType/useFieldType.types';
import { UseFieldTypes } from './hooks/useFieldTypes/useFieldTypes.types';
import { UseFieldTypesUIStates } from './hooks/useFieldTypesUIStates/useFieldTypesUIStates.types';
import { UseNavItemMatcher } from './hooks/useNavItemMatcher/useNavitemMatcher.types';
import { UsePaginatedPresets } from './hooks/usePaginatedPresets/usePaginatedPresets.types';
import { UsePreset } from './hooks/usePreset/usePreset.types';
import { UsePresets } from './hooks/usePresets/usePresets.types';
import { UsePresetsUIStates } from './hooks/usePresetsUIStates/usePresetsUIStates.types';
import {
	ContentTypeResponse,
	ContentTypesApiService,
	Field,
	ModuleSettings,
} from './services/contentTypes';
import { FieldType, FieldTypeMeta, FieldTypesApiService } from './services/fieldTypes';
import { MetadataApiService } from './services/metadata';
import { Preset, PresetsApiService } from './services/presets';
import {
	ContentTypeDetailModel,
	ContentTypeFieldDetailModel,
	ContentTypesFacade,
	FieldsByCompartment,
} from './store/contentTypes';
import { DynamicFieldDetailModel } from './store/dynamicField/dynamicField.model';
import { FieldTypesFacade } from './store/fieldTypes';
import { MetadataFacade } from './store/metadata';
import { PresetDetailModel, PresetsFacade } from './store/presets';
import {
	ContentTypesCCConfig,
	ContentTypesCCSettings,
	ContentTypesCCValidation,
} from './views/tenant';

export interface ContentTypesModuleProps<Params extends { [K in keyof Params]?: string } = {}>
	extends RouteConfigComponentProps<Params> {
	routes: ModuleRouteConfig[];
	tenantId: string;
}

export interface ContentTypesRouteParams extends CtBaseParams {
	contentTypeUuid: string;
}

export interface ContentTypesRouteProps<Params = ContentTypesRouteParams>
	extends RouteConfigComponentProps<Params> {
	routes: ModuleRouteConfig[];
}

export interface SiteContentTypesDetailRouteParams extends CtBaseParams {
	siteId: string;
	contentTypeUuid: string;
}

export interface ContentTypesDetailRouteParams extends CtBaseParams {
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
		tab: Tab,
		cb?: () => void
	) => void;
	onDelete?: () => Promise<void>;
	readonly activeField: ContentTypeFieldDetailModel | null;
	readonly fieldsHaveChanged: boolean;
}

export interface ContentTypesSiteDetailRoutePropsParams<Params = ContentTypesDetailRouteParams>
	extends ContentTypesDetailRouteProps<Params> {
	canUpdate: boolean;
	isLoading: boolean;
}

export interface ContentTypesCCRouteProps extends ContentTypesRouteProps {
	readonly CTField: ContentTypeFieldDetailModel;
	readonly fieldType: FieldType;
	readonly preset?: PresetDetailModel;
	readonly parentPreset?: PresetDetailModel;
	readonly dynamicFieldSettingsContext?: {
		dynamicField: DynamicFieldDetailModel;
		getCreatePath: (isPreset: boolean, fieldTypeUuid: string) => string;
		getEditPath: (uuid: string) => string;
		setDynamicField: (field: Field) => void;
	};
	onDelete?: () => void;
	onSubmit: (data: any) => void;
	formikRef: FormikRef;
	contentType: ContentTypeResponse;
	activeLanguages: LanguagesSchema[];
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
		multiLanguage: boolean;
	};
}

export interface Tab extends ContextHeaderTab {
	id?: string;
	type: TabTypes;
	containerId: ALERT_CONTAINER_IDS;
}

export enum TabTypes {
	'INTERNAL',
	'EXTERNAL',
}

export type FormikRef = FormikConfig<FormikValues>['innerRef'];

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
		contentTypes: {
			service: ContentTypesApiService;
			facade: ContentTypesFacade;
		};
		metadata: {
			service: MetadataApiService;
			facade: MetadataFacade;
		};
	};
	hooks: {
		// Presets
		useActivePreset: UseActivePreset;
		usePreset: UsePreset;
		usePaginatedPresets: UsePaginatedPresets;
		usePresets: UsePresets;
		usePresetsUIStates: UsePresetsUIStates;
		// Field types
		useActiveFieldType: UseActiveFieldType;
		useFieldType: UseFieldType;
		useFieldTypes: UseFieldTypes;
		useFieldTypesUIStates: UseFieldTypesUIStates;
		// Content Type
		useContentType: UseContentType;
		// Other
		useNavItemMatcher: UseNavItemMatcher;
	};
	views: {
		tenant: {
			ContentTypesCCConfig: typeof ContentTypesCCConfig;
			ContentTypesCCSettings: typeof ContentTypesCCSettings;
			ContentTypesCCValidation: typeof ContentTypesCCValidation;
		};
	};
	helpers: {
		configurationCompartmentValidator: typeof configurationCompartmentValidator;
		defaultValueCompartmentValidator: typeof defaultValueCompartmentValidator;
		settingsCompartmentValidator: typeof settingsCompartmentValidator;
		validationCompartmentValidator: typeof validationCompartmentValidator;
		generateConfig: typeof generateConfig;
		generateValidationChecks: typeof generateValidationChecks;
		createInitialValuesFromChecks: typeof createInitialValuesFromChecks;
		generateConfigFromValidationData: typeof generateConfigFromValidationData;
		generateFormSchemaFromPreset: typeof generateFormSchemaFromPreset;
		generateFormSchemaFromFieldTypeData: typeof generateFormSchemaFromFieldTypeData;
	};
}

export type AlertMessages<T extends string | number | symbol> = Record<
	T,
	{ [key in 'success' | 'error']?: AlertProps }
>;

export interface OverviewFilterItem extends FilterItem {
	filterKey: string;
	formvalue?: any;
}

export enum CtTypes {
	contentTypes = 'content-types',
	contentBlocks = 'content-blokken',
}

export interface CtBaseParams {
	ctType: CtTypes;
	siteId: string;
}

export interface ContentTypeDetailMatchProps {
	tab: string;
	siteId: string;
}

export interface ExternalTabValue {
	config: ModuleSettings['config'];
	validationSchema: ModuleSettings['validationSchema'];
}

export interface ExternalTabProps {
	contentType: ContentTypeDetailModel;
	value: ExternalTabValue;
	isLoading: boolean;
	onSubmit: (value: ExternalTabValue) => void;
	onCancel: () => void;
	updateContentType: (e: ContentTypeDetailModel) => void;
}
