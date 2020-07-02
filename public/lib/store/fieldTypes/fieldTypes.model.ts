import { FieldType, FieldTypeData } from '../../services/fieldTypes';
import { BaseEntityState } from '../shared';

export type FieldTypeModel = FieldType;
export type FieldTypeDetailModel = FieldTypeData;

export interface FieldTypesState extends BaseEntityState<FieldTypeModel, string> {
	fieldType?: FieldTypeDetailModel;
}
