import { EntityState } from '@datorama/akita';

import {
	ContentTypeDetailResponse,
	ContentTypeFieldDetailResponse,
	ContentTypePaging,
	ContentTypeResponse,
} from '../../services/contentTypes';

export type ContentTypeModel = ContentTypeResponse;
export type ContentTypeDetailModel = ContentTypeDetailResponse;
export type ContentTypeFieldDetailModel = ContentTypeFieldDetailResponse;

export interface ContentTypesState extends EntityState<ContentTypeModel, string> {
	meta?: ContentTypePaging;
	contentType?: ContentTypeDetailModel;
	activeField?: ContentTypeFieldDetailModel;
	isFetching: boolean;
	isCreating: boolean;
	isUpdating: boolean;
}

export const createInitialSitesState = (): ContentTypesState => ({
	loading: false,
	isFetching: false,
	isCreating: false,
	isUpdating: false,
	isActivating: false,
});
