import { BaseEntityState } from '@redactie/utils';

import { Field } from '../../services/contentTypes/contentTypes.service.types';

export type DynamicFieldsModel = Field[];
export type DynamicFieldDetailModel = Field;

export interface DynamicFieldState extends BaseEntityState<DynamicFieldsModel, string> {
	dynamicField?: DynamicFieldDetailModel;
	activeField?: DynamicFieldDetailModel;
}
