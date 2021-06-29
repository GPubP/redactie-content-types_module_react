import { FormSchema } from '@redactie/form-renderer-module';

import formRendererConnector from '../../connectors/formRenderer';
import { FieldTypeData } from '../../services/fieldTypes/fieldTypes.service.types';

export const generateFormSchemaFromFieldTypeData = (fieldTypeData: FieldTypeData): FormSchema => {
	const fields = Array.isArray(fieldTypeData?.validators)
		? fieldTypeData.validators.reduce((acc, validator) => {
				return [...acc, ...validator.data?.formSchema?.fields];
		  }, [])
		: [];

	const valueSyncMap = formRendererConnector.api.getValueSyncMap(fields);

	return {
		fields: formRendererConnector.api.parseFields(fields, { valueSyncMap }),
	};
};
