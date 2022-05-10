import Core from '@redactie/redactie-core';

import formRendererConnector from '../connectors/formRenderer';

import { ContentTypeAPI } from './api.types';
import { helpers } from './helpers';
import { hooks } from './hooks';
import { registerCTDetailTab } from './registerCTDetailTab';
import { store } from './store';
import { views } from './views';

const API: ContentTypeAPI = {
	registerCTDetailTab,
	parseFields: formRendererConnector.api.parseFields,
	store,
	hooks,
	views,
	helpers,
};

export const registerContentTypeAPI = (): void => {
	Core.modules.exposeModuleApi('content-type-module', API);
};

export { API };
