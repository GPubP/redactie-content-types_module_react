import { FieldType } from '../../services/fieldTypes';
import { PresetDetailModel } from '../../store/presets';

export type UseNavItemMatcher = (
	preset: PresetDetailModel | null | undefined,
	fieldType: FieldType | null | undefined
) => FieldType;
