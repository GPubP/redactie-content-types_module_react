import { Field } from '../../services/contentTypes/contentTypes.service.types';
import { BaseEntityState } from '../shared';

export type DynamicFieldsModel = Field[];
export type DynamicFieldDetailModel = Field;

export interface DynamicFieldState extends BaseEntityState<DynamicFieldsModel, string> {
	dynamicField?: DynamicFieldDetailModel;
	activeField?: DynamicFieldDetailModel;
}
