import { Field } from '../../services/contentTypes';

export function fieldsHasMultiLanguage(fields: Field[]): boolean {
	return !!fields.find(field => {
		if (!Array.isArray(field.config?.fields) || !field.config.fields.length) {
			return field.generalConfig.multiLanguage;
		}

		return fieldsHasMultiLanguage(field.config.fields);
	});
}
