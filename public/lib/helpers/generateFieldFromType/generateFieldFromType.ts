import { v4 as uuidv4 } from 'uuid';

import { ContentTypeFieldDetailModel } from '../../store/contentTypes';
import { FieldTypeModel } from '../../store/fieldTypes';
import { PresetDetailModel } from '../../store/presets';
import { generateValidationChecks } from '../generateValidationChecks';

export const generateFieldFromType = (
	fieldType: FieldTypeModel,
	initialValues: Partial<ContentTypeFieldDetailModel> = {},
	preset?: PresetDetailModel
): ContentTypeFieldDetailModel => ({
	__new: true,
	uuid: uuidv4(),
	label: '',
	module: fieldType.data.module || '',
	name: '',
	config: {
		fields: preset
			? preset.data?.fields.map(field => ({
					...field.field,
			  }))
			: [],
	},
	validators: [],
	validation: generateValidationChecks({}, fieldType.data, preset),
	operators: [],
	generalConfig: {
		guideline: '',
		required: true,
		hidden: false,
		min: 0,
		max: 1,
	},
	...initialValues,
	dataType: fieldType.data.dataType,
	fieldType,
	preset,
});
