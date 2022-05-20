/**
 * @module Module API
 */
import formRendererConnector from '../connectors/formRenderer';

import { helpers } from './helpers';
import { hooks } from './hooks';
import { registerCTDetailTab } from './registerCTDetailTab';
import { store } from './store';
import { views } from './views';

const parseFields = formRendererConnector.api.parseFields;

export { registerCTDetailTab, parseFields, store, hooks, views, helpers };
