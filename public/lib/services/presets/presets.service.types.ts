import { Field } from '../contentTypes';
import { FieldType } from '../fieldTypes';
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

export interface BasePreset<T, F> {
	_id: string;
	uuid: string;
	data: {
		name: string;
		label: string;
		defaultConfig: Record<string, any>;
		fieldType: F;
		generalConfig: {
			isQueryable: boolean;
			isTranslate: boolean;
			isMultiple: boolean;
		};
		fields: {
			field: any;
			formSchema: {
				fields: Field[];
			};
			validators: T[];
		}[];
		validators: T[];
		meta: {
			created: string;
			lastModified: string;
			deleted: boolean;
		};
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

export type Preset = BasePreset<string, string>;

export type PresetDetail = BasePreset<Validator, FieldType>;

/**
 * =========================
 * Response types
 * - Define all response interfaces coming from the server
 * =========================
 */

export interface PresetsResponse {
	data: Preset[];
}
