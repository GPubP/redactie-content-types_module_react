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
			fields: any[];
		};
	};
	meta: {
		created: string;
		lastModified: string;
		lastEditor: string;
		deleted: string;
	};
}

export interface BasePreset<T> {
	_id: string;
	uuid: string;
	data: {
		name: string;
		label: string;
		defaultConfig: Record<string, any>;
		fieldType?: string;
		generalConfig: {
			isQueryable: boolean;
			isTranslate: boolean;
			isMultiple: boolean;
		};
		fields: {
			field: any;
			formSchema: {
				fields: any[];
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
}

export type Preset = BasePreset<string>;

export type PresetDetail = BasePreset<Validator>;

/**
 * =========================
 * Response types
 * - Define all response interfaces coming from the server
 * =========================
 */

export interface PresetsResponse {
	data: Preset[];
}
