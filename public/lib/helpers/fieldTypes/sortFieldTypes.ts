import { FieldType } from '../../services/fieldTypes';
import { Preset } from '../../services/presets';

export const sortFieldTypes = (a: FieldType | Preset, b: FieldType | Preset): number => {
	const nameA = a.data?.label?.toUpperCase(); // ignore upper and lowercase
	const nameB = b.data?.label?.toUpperCase(); // ignore upper and lowercase

	if (nameA < nameB) {
		return -1;
	}

	if (nameA > nameB) {
		return 1;
	}

	return 0;
};
