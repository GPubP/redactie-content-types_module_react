import { createContext } from 'react';

import { DynamicFieldSettingsContextValue } from './DynamicFieldSettings.types';

const DynamicFieldSettingsContext = createContext<DynamicFieldSettingsContextValue>({
	getCreatePath: () => '',
	getEditPath: () => '',
	setDynamicField: () => null,
});

export default DynamicFieldSettingsContext;
