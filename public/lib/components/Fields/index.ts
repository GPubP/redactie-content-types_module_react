import formRendererConnector from '../../connectors/formRenderer';
import { DYNAMIC_FIELD_SETTINGS_NAME } from '../../contentTypes.const';
import { CCTextWithStyle } from '../ccViews/TextWithStyle';
import { CCTextareaWithStyle } from '../ccViews/TextareaWithStyle';

import { ContentTypesSelect } from './ContentTypesSelect';
import { DynamicFieldSettings } from './DynamicFieldSettings';
import { TextWithStyle } from './TextWithStyle';
import { TextareaWithStyle } from './TextareaWithStyle';

export * from './ContentTypesSelect';
export * from './DynamicFieldSettings';
export * from './TextWithStyle';
export * from './TextareaWithStyle';

export const registerFields = (): void =>
	formRendererConnector.api.fieldRegistry.add([
		{
			name: DYNAMIC_FIELD_SETTINGS_NAME,
			module: 'content-types',
			component: DynamicFieldSettings,
		},
		{
			name: 'contentTypesSelect',
			module: 'content-types',
			component: ContentTypesSelect,
		},
		{
			name: 'textWithStyle',
			module: 'content-types',
			component: TextWithStyle,
			viewComponent: CCTextWithStyle,
		},
		{
			name: 'textareaWithStyle',
			module: 'content-types',
			component: TextareaWithStyle,
			viewComponent: CCTextareaWithStyle,
		},
	]);
