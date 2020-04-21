import { ContentTypeFieldResponse } from '../../services/contentTypes';

export type ContentTypeField = ContentTypeFieldResponse;

export interface InternalState {
	readonly activeField: ContentTypeField | null;
	readonly fields: ContentTypeField[];
}
