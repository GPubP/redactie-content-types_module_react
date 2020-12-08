import { v4 as uuidv4 } from 'uuid';

import { CONTENT_COMPARTMENT_UUID } from '../../contentTypes.const';
import { ContentTypeFieldDetailModel } from '../../store/contentTypes';
import { FieldTypeDetailModel } from '../../store/fieldTypes';
import { PresetDetailModel } from '../../store/presets';
import { generateConfig } from '../generateConfig';
import { generateValidationChecks } from '../generateValidationChecks';

export const generateFieldFromType = (
	fieldType: FieldTypeDetailModel,
	initialValues: Partial<ContentTypeFieldDetailModel> = {},
	fieldCompartmentUUID = CONTENT_COMPARTMENT_UUID,
	preset?: PresetDetailModel
): ContentTypeFieldDetailModel => ({
	__new: true,
	uuid: uuidv4(),
	label: '',
	module: fieldType.data.module || '',
	name: '',
	config: generateConfig(fieldType.data, preset),
	validators: [],
	validation: generateValidationChecks({}, fieldType.data, preset, true),
	operators: [],
	...initialValues,
	generalConfig: {
		guideline: '',
		required: false,
		hidden: false,
		min: 0,
		max: 1,
		...initialValues.generalConfig,
	},
	dataType: fieldType.data.dataType,
	fieldType,
	preset,
	compartment: {
		uuid: fieldCompartmentUUID,
		position: 0, // dynamic set position
	},
});
