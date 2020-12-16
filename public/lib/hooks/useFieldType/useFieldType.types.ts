import { FieldTypeDetailModel, FieldTypeDetailUIModel } from '../../store/fieldTypes';

export type UseFieldType = (
	presetId?: string
) => [FieldTypeDetailModel | undefined, FieldTypeDetailUIModel | undefined];
