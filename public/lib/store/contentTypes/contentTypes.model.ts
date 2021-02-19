import { BaseEntityState } from '@redactie/utils';

import {
	ContentTypeDetailResponse,
	ContentTypeFieldDetail,
	ContentTypePaging,
	ContentTypeResponse,
} from '../../services/contentTypes';

export type ContentTypeModel = ContentTypeResponse;
export type ContentTypeDetailModel = ContentTypeDetailResponse;
export type ContentTypeFieldDetailModel = ContentTypeFieldDetail;

export interface ContentTypesState extends BaseEntityState<ContentTypeModel, string> {
	meta?: ContentTypePaging;
	contentType?: ContentTypeDetailModel;
	activeField?: ContentTypeFieldDetailModel;
}

export interface FieldsByCompartment {
	uuid: string;
	label: string;
	fields?: ContentTypeFieldDetail[];
}
