import { v4 as uuidv4 } from 'uuid';

import { CONTENT_COMPARTMENT_UUID } from '../../contentTypes.const';
import { ContentTypeFieldDetailModel } from '../../store/contentTypes';
import { FieldTypeDetailModel } from '../../store/fieldTypes';
import { PresetDetailModel } from '../../store/presets';
import { createInitialValuesFromChecks } from '../createInitialValuesFromChecks';
import { generateConfig } from '../generateConfig';
import { generateConfigFromValidationData } from '../generateConfigFromValidationData';
import { generateValidationChecks } from '../generateValidationChecks';

export const generateFieldFromType = (
	fieldType: FieldTypeDetailModel,
	initialValues: Partial<ContentTypeFieldDetailModel> = {},
	fieldCompartmentUUID = CONTENT_COMPARTMENT_UUID,
	preset?: PresetDetailModel
): ContentTypeFieldDetailModel => {
	// Generate default validation checks
	const validation = generateValidationChecks({}, fieldType.data, preset);
	// Generate formdata based on these checks (needed for config generation)
	const validationData = createInitialValuesFromChecks(validation.checks);
	// Generate baseConfig
	const baseConfig = generateConfig(fieldType.data, preset);
	// Enrich the baseConfig with required settings

	// TODO: add schema
	const config = generateConfigFromValidationData(validationData, preset, baseConfig);

	return {
		__new: true,
		uuid: uuidv4(),
		label: '',
		module: fieldType.data.module || '',
		name: '',
		config,
		validators: [],
		validation,
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
	};
};
