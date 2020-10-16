import Core from '@redactie/redactie-core';

import { parseFields } from '../helpers/parseFields/parseFields';

import { registerCTDetailTab } from './registerCTDetailTab';

export const registerContentTypeAPI = (): void =>
	Core.modules.exposeModuleApi('content-type-module', {
		registerCTDetailTab,
		parseFields,
	});
