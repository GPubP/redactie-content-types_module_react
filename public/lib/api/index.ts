import Core from '@redactie/redactie-core';

import formRendererConnector from '../connectors/formRenderer';

import { registerCTDetailTab } from './registerCTDetailTab';

export const registerContentTypeAPI = (): void =>
	Core.modules.exposeModuleApi('content-type-module', {
		registerCTDetailTab,
		parseFields: formRendererConnector.api.parseFields,
	});
