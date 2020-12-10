import { createContext } from 'react';

import { DynamicFieldSettingsContextValue } from './DynamicFieldSettings.types';

const DynamicFieldSettingsContext = createContext<DynamicFieldSettingsContextValue>({});

export default DynamicFieldSettingsContext;
