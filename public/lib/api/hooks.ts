import { ContentTypeAPI } from '../contentTypes.types';
import {
	useActiveFieldType,
	useActivePreset,
	useContentType,
	useFieldType,
	useFieldTypes,
	useFieldTypesUIStates,
	useNavItemMatcher,
	usePaginatedPresets,
	usePreset,
	usePresets,
	usePresetsUIStates,
} from '../hooks';

export const hooks: ContentTypeAPI['hooks'] = {
	// Presets
	useActivePreset,
	usePreset,
	usePaginatedPresets,
	usePresets,
	usePresetsUIStates,
	// Field types
	useActiveFieldType,
	useFieldType,
	useFieldTypes,
	useFieldTypesUIStates,
	// Content Types
	useContentType,
	// Other
	useNavItemMatcher,
};
