import { ExternalTabOptions } from '../store/api/externalTabs';

export { ContentTypeDetailModel, ContentTypeFieldDetailModel } from '../store/contentTypes';

export { ExternalTabProps } from '../views/ContentTypeDetailExternal/ContentTypeDetailExternal.types';

export interface ContentTypeAPI {
	registerCTDetailTab: (name: string, options: ExternalTabOptions) => void;
}
export { ExternalTabOptions };
