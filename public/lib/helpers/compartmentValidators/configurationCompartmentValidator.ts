import formRendererConnector from '../../connectors/formRenderer';
import { ContentTypeFieldDetail } from '../../services/contentTypes';
import { FieldType } from '../../services/fieldTypes/fieldTypes.service.types';
import { Preset } from '../../services/presets';

export const configurationCompartmentValidator = (
	values: ContentTypeFieldDetail,
	fieldType?: FieldType,
	preset?: Preset
): boolean => {
	const validationSchema =
		preset?.validateSchema?.configuration || fieldType?.validateSchema?.configuration || {};
	const errorMessages =
		preset?.errorMessages?.configuration || fieldType?.errorMessages?.configuration || {};

	const validator = new (formRendererConnector.api as any).CustomValidator(
		validationSchema,
		errorMessages,
		{
			allErrors: true,
			messages: true,
		}
	);

	const validated = validator.validate(values?.config || {});

	return typeof validated !== 'object' || !Object.keys(validated).length;
};
