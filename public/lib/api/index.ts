import Core from '@redactie/redactie-core';

import formRendererConnector from '../connectors/formRenderer';

import { ContentTypeAPI } from './api.types';
import { hooks } from './hooks';
import { registerCTDetailTab } from './registerCTDetailTab';
import { store } from './store';
import { views } from './views';

export const registerContentTypeAPI = (): void => {
	const api: ContentTypeAPI = {
		registerCTDetailTab,
		parseFields: formRendererConnector.api.parseFields,
		store,
		hooks,
		views,
	};
	Core.modules.exposeModuleApi('content-type-module', api);
};
