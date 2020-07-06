import { FieldType } from '../../services/fieldTypes';
import { BaseEntityState } from '../shared';

export type FieldTypeModel = FieldType;
export type FieldTypeDetailModel = FieldType;

export interface FieldTypesState extends BaseEntityState<FieldTypeModel, string> {
	fieldType?: FieldTypeDetailModel;
}
