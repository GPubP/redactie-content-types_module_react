import { FieldTypeDetailModel, FieldTypeDetailUIModel } from '../../store/fieldTypes';

export type UseActiveFieldType = (
	presetId?: string
) => [FieldTypeDetailModel | undefined, FieldTypeDetailUIModel | undefined];
