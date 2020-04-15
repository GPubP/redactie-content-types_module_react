import { ContentTypeFieldResponse, ContentTypeFieldSchema } from '../../services/contentTypes';

export interface InternalState {
	readonly activeField: ContentTypeFieldResponse | null;
	readonly fields: (ContentTypeFieldResponse | ContentTypeFieldSchema)[];
}
