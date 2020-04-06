import { FieldSchema, FormsAPI, FormSchema } from '@redactie/form-renderer-module';
import Core from '@redactie/redactie-core';
import React, { FC } from 'react';

import { ContentTypesCCConfigProps } from './ContentTypesCCConfig.types';

const ContentTypesCCConfig: FC<ContentTypesCCConfigProps> = ({ fieldData }) => {
	/**
	 * Methods
	 */
	const formsAPI = Core.modules.getModuleAPI('forms-module') as FormsAPI;

	// TODO: replace this with actual validation schema (fieldData.validationSchema)
	const validationSchema = {
		$schema: 'http://json-schema.org/draft-07/schema#',
		type: 'object',
		properties: {},
	};

	const mapFormSchema = (): FormSchema => {
		if (!fieldData?.formSchema) {
			return { fields: [] };
		}
		return {
			fields: fieldData.formSchema.fields.map(
				(field): FieldSchema => ({
					name: field.name,
					module: field.fieldType?.data?.module,
					label: field.label,
					type: field.fieldType?.data?.componentName,
					config: field.config,
					dataType: 'string',
				})
			),
		};
	};

	/**
	 * Render
	 */

	if (!formsAPI || !fieldData?.formSchema) {
		return null;
	}

	return (
		<formsAPI.Form
			schema={mapFormSchema()}
			validationSchema={validationSchema}
			errorMessages={{}}
		/>
	);
};

export default ContentTypesCCConfig;
