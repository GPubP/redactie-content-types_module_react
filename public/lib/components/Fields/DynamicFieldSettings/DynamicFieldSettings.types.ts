import { ValidationCheckWithAllowedFields } from '@wcm/jsonschema-generator';

import { Field } from '../../../services/contentTypes';

export interface DynamicFieldCCRow {
	id: string;
	label: string;
	path: string;
	name: string;
	multiple: boolean;
	fieldType: string;
	required: boolean;
	hidden: boolean;
	translatable: boolean;
}

export interface DynamicFieldSettingsContextValue {
	activeField?: Field;
	dynamicField?: Field;
	getCreatePath?: (isPreset: boolean, fieldTypeUuid: string) => string;
	getEditPath?: (uuid: string) => string;
	setDynamicField?: (field: Field) => void;
}

export interface DynamicFieldFormikContextValues {
	[key: string]: {
		config: Field[];
		validation: ValidationCheckWithAllowedFields;
		minValue: number;
		maxValue: number;
	};
}
