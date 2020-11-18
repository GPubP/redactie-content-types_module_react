import formRendererConnector from '../../connectors/formRenderer';
import { ContentTypeFieldDetail } from '../../services/contentTypes';
import { FieldType } from '../../services/fieldTypes/fieldTypes.service.types';
import { Preset } from '../../services/presets';

export const validationCompartmentValidator = (
	values: ContentTypeFieldDetail,
	fieldType?: FieldType,
	preset?: Preset
): boolean => {
	const validationSchema =
		preset?.validateSchema.validation.dataSchema ||
		fieldType?.validateSchema.validation.dataSchema;
	const errorMessages =
		preset?.errorMessages.validation.dataSchema ||
		fieldType?.errorMessages.validation.dataSchema ||
		{};

	const validator = new (formRendererConnector.api as any).CustomValidator(
		validationSchema,
		errorMessages,
		{
			allErrors: true,
			messages: true,
		}
	);

	const validated = validator.validate(values?.validation || {});

	return typeof validated !== 'object' || !Object.keys(validated).length;
};
