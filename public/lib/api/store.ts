import { ContentTypeAPI } from '../contentTypes.types';
import { presetsApiService } from '../services/presets';
import { presetsFacade } from '../store/presets';

export const store: ContentTypeAPI['store'] = {
	presets: {
		service: presetsApiService,
		facade: presetsFacade,
	},
};
