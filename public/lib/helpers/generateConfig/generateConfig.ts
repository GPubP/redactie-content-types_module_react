import { Field } from '../../services/contentTypes';
import { FieldTypeData } from '../../services/fieldTypes';
import { PresetDetail } from '../../services/presets';

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

const generateConfigFromPreset = (preset: PresetDetail): Field[] =>
	preset.data?.fields.reduce((acc, field) => {
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
	}, [] as Field[]);

export const generateConfig = (
	fieldTypeData: FieldTypeData,
	preset?: PresetDetail
): Record<string, any> => ({
	...generateConfigFromDefaultConfig(fieldTypeData.defaultConfig),
	...generateConfigFromDefaultValue(fieldTypeData.formSchema?.fields),
	fields: preset ? generateConfigFromPreset(preset) : [],
});
