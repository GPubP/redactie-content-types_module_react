import Core from '@redactie/redactie-core';

import * as API from './api';

export const registerContentTypeAPI = (): void => {
	Core.modules.exposeModuleApi('content-type-module', API);
};

export { API };
