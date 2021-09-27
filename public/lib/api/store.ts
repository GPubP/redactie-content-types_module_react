import { ContentTypeAPI } from '../contentTypes.types';
import { contentTypesApiService } from '../services/contentTypes';
import { fieldTypesApiService } from '../services/fieldTypes';
import { presetsApiService } from '../services/presets';
import { contentTypesFacade } from '../store/contentTypes';
import { fieldTypesFacade } from '../store/fieldTypes';
import { presetsFacade } from '../store/presets';

export const store: ContentTypeAPI['store'] = {
	presets: {
		service: presetsApiService,
		facade: presetsFacade,
	},
	fieldTypes: {
		service: fieldTypesApiService,
		facade: fieldTypesFacade,
	},
	contentTypes: {
		service: contentTypesApiService,
		facade: contentTypesFacade,
	},
};
