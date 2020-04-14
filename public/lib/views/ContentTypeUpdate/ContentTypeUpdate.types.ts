import { ContentTypeFieldSchema } from '../../services/contentTypes';

export enum ContentTypeUpdateActionTypes {
	UPDATE_FIELDS = '@@content-type-update/UPDATE_FIELDS',
	UPDATE_ACTIVE_FIELD = '@@content-type-update/UPDATE_ACTIVE_FIELD',
}

export interface ContentTypeUpdateAction<
	T extends ContentTypeUpdateActionTypes = ContentTypeUpdateActionTypes
> {
	type: T;
	payload: T extends ContentTypeUpdateActionTypes.UPDATE_ACTIVE_FIELD
		? ContentTypeFieldSchema
		: ContentTypeFieldSchema[];
}

export interface ContentTypeUpdateState {
	readonly fields: ContentTypeFieldSchema[];
	readonly activeField: ContentTypeFieldSchema | null;
}
