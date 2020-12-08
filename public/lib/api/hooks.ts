import { ContentTypeAPI } from '../contentTypes.types';
import { useActivePreset, usePaginatedPresets, usePresets, usePresetsUIStates } from '../hooks';

export const hooks: ContentTypeAPI['hooks'] = {
	useActivePreset,
	usePaginatedPresets,
	usePresets,
	usePresetsUIStates,
};
