import { ContentTypeAPI } from '../contentTypes.types';
import {
	useActiveFieldType,
	useActivePreset,
	useFieldTypes,
	useFieldTypesUIStates,
	usePaginatedPresets,
	usePresets,
	usePresetsUIStates,
} from '../hooks';

export const hooks: ContentTypeAPI['hooks'] = {
	// Presets
	useActivePreset,
	usePaginatedPresets,
	usePresets,
	usePresetsUIStates,
	// Field types
	useActiveFieldType,
	useFieldTypes,
	useFieldTypesUIStates,
};
