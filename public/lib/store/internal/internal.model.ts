import { ContentTypeFieldSchema } from '../../services/contentTypes';

export interface InternalState {
	readonly activeField: ContentTypeFieldSchema | null;
	readonly fields: ContentTypeFieldSchema[];
}
