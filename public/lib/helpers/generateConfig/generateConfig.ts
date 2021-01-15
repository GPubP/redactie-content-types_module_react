import { Field } from '../../services/contentTypes';
import { FieldTypeData } from '../../services/fieldTypes';
import { PresetDetailFieldModel, PresetDetailModel } from '../../store/presets';

const generateConfigFromDefaultConfig = (
	defaultConfig: Record<string, any> = {}
): Record<string, any> => defaultConfig;

const generateConfigFromDefaultValue = (fields: Field[] = []): Record<string, any> =>
	fields.reduce((acc, field) => {
		if (field.defaultValue) {
			acc[field.name] = field.defaultValue;
		}
		return acc;
	}, {} as Record<string, any>);

const generateConfigFromPreset = (
	preset?: PresetDetailModel
): { fields: PresetDetailFieldModel[] } => {
	if (!preset) {
		return {
			fields: [],
		};
	}

	const fields = preset.data?.fields.reduce((acc, field) => {
		const newField = {
			...field.field,
		};
		field.formSchema.fields.forEach(f => {
			if (f.defaultValue) {
				newField.config = {
					...newField.config,
					[f.name]: f.defaultValue,
				};
			}
		});
		acc.push(newField);
		return acc;
	}, [] as PresetDetailFieldModel[]);

	const validationConfig = fields.reduce((acc, field) => {
		acc[field.name] = field.config;
		return acc;
	}, {} as Record<string, any>);

	return {
		fields,
		...validationConfig,
	};
};

export const generateConfig = (
	fieldTypeData: FieldTypeData,
	preset?: PresetDetailModel
): Record<string, any> => ({
	...generateConfigFromDefaultConfig(fieldTypeData.defaultConfig),
	...generateConfigFromDefaultValue(fieldTypeData.formSchema?.fields),
	...generateConfigFromPreset(preset),
});
