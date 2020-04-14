import { ContentTypeFieldSchema } from '../../services/contentTypes';

import {
	ContentTypeUpdateAction,
	ContentTypeUpdateActionTypes,
	ContentTypeUpdateState,
} from './ContentTypeUpdate.types';

export const generateInitialState = (): ContentTypeUpdateState => ({
	activeField: null,
	fields: [],
});

export const contentTypeUpdateReducer = (
	state: ContentTypeUpdateState,
	action: ContentTypeUpdateAction<ContentTypeUpdateActionTypes>
): ContentTypeUpdateState => {
	switch (action.type) {
		case ContentTypeUpdateActionTypes.UPDATE_ACTIVE_FIELD:
			return { ...state, activeField: action.payload as ContentTypeFieldSchema };
		case ContentTypeUpdateActionTypes.UPDATE_FIELDS:
			return { ...state, fields: action.payload as ContentTypeFieldSchema[] };

		default:
			return state;
	}
};
