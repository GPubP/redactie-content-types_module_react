import { ExternalTabOptions } from '../store/api/externalTabs';

export {
	ContentTypeSchema,
	ContentTypeFieldSchema,
} from '../services/contentTypes/contentTypes.service.types';

export { ExternalTabProps } from '../views/ContentTypeDetailExternal/ContentTypeDetailExternal.types';

export interface ContentTypeAPI {
	registerCTDetailTab: (name: string, options: ExternalTabOptions) => void;
}
export { ExternalTabOptions };
