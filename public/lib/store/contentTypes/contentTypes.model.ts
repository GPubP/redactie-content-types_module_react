import {
	ContentTypeDetailResponse,
	ContentTypeFieldDetail,
	ContentTypePaging,
	ContentTypeResponse,
} from '../../services/contentTypes';
import { BaseEntityState } from '../shared';

export type ContentTypeModel = ContentTypeResponse;
export type ContentTypeDetailModel = ContentTypeDetailResponse;
export type ContentTypeFieldDetailModel = ContentTypeFieldDetail;

export interface ContentTypesState extends BaseEntityState<ContentTypeModel, string> {
	meta?: ContentTypePaging;
	contentType?: ContentTypeDetailModel;
	activeField?: ContentTypeFieldDetailModel;
}
