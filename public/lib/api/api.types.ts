import { FormsAPI } from '@redactie/form-renderer-module';

import { ExternalTabOptions } from '../store/api/externalTabs';

import { registerCTDetailTab } from './registerCTDetailTab';

export { ContentTypeDetailModel, ContentTypeFieldDetailModel } from '../store/contentTypes';

export { ExternalTabProps } from '../views/tenant/ContentTypesDetailExternal';

export interface ContentTypeAPI {
	registerCTDetailTab: typeof registerCTDetailTab;
	parseFields: FormsAPI['parseFields'];
}
export { ExternalTabOptions };
