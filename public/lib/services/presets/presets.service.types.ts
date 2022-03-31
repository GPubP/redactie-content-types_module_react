import { EmbeddedResponse } from '@redactie/utils';

import { Field } from '../contentTypes';
import { DataType, FieldType, MapValueToContentItemPath } from '../fieldTypes';

/**
 * =========================
 * Base types
 * =========================
 */

export interface Validator {
	uuid: string;
	data: {
		name: string;
		label: string;
		description: string;
		dataTypes: string[];
		defaultValue: Record<string, any>;
		formSchema: {
			fields: Field[];
		};
	};
	meta: {
		created: string;
		lastModified: string;
		lastEditor: string;
		deleted: string;
	};
}

export type PresetField<D = string, F = string> = Omit<Field<D, F>, 'compartment'>;
export type PresetDetailField = PresetField<DataType, FieldType>;

export interface BasePreset<V = string, D = string, F = string> {
	_id: string;
	uuid: string;
	data: {
		name: string;
		label: string;
		description: string;
		defaultConfig: Record<string, any>;
		fieldType: F;
		generalConfig: {
			isQueryable: boolean;
			isTranslatable: boolean;
			defaultTranslateValue: boolean;
			isMultiple: boolean;
			allowDefault: boolean;
			removable?: boolean;
			mapValueToContentItemPath?: MapValueToContentItemPath[];
		};
		fields: {
			field: PresetField<D, F>;
			formSchema: {
				fields: Field[];
			};
			validators: V[];
		}[];
		validators: V[];
	};
	meta: {
		created: string;
		lastModified: string;
		deleted: boolean;
		active: boolean;
		default: boolean;
		occurrences: {
			name: string;
			uuid: string;
		}[];
	};
	validateSchema: {
		configuration: object;
		validation: {
			formSchema: object;
			dataSchema: object;
		};
	};
	errorMessages: {
		configuration: Record<string, string>;
		validation: {
			formSchema: Record<string, string>;
			dataSchema: Record<string, string>;
		};
	};
}

export type Preset = BasePreset<string, string, string>;

/**
 * =========================
 * Response types
 * - Define all response interfaces coming from the server
 * =========================
 */

export type PresetDetailResponse = BasePreset<Validator, DataType, FieldType>;

export type PresetsResponse = EmbeddedResponse<Preset>;

/**
 * =========================
 * Payload types
 * - Define all payload interfaces
 * =========================
 */

export interface UpdatePresetPayload {
	uuid: string;
	body: {
		data: PresetDetailResponse['data'];
	};
}

export interface CreatePresetPayload {
	data: {
		name: string;
		label: string;
		fieldType: string;
		fields?: PresetDetailResponse['data']['fields'];
		validators?: string[];
	};
}
