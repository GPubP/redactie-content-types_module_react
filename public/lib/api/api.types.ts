import { parseFields } from '../helpers/parseFields/parseFields';
import { ExternalTabOptions } from '../store/api/externalTabs';

import { registerCTDetailTab } from './registerCTDetailTab';

export { ContentTypeDetailModel, ContentTypeFieldDetailModel } from '../store/contentTypes';

export { ExternalTabProps } from '../views/tenant/ContentTypesDetailExternal';

export interface ContentTypeAPI {
	registerCTDetailTab: typeof registerCTDetailTab;
	parseFields: typeof parseFields;
}
export { ExternalTabOptions };
