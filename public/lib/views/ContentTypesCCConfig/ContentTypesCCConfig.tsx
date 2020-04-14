import { FieldSchema, FormsAPI, FormSchema } from '@redactie/form-renderer-module';
import Core from '@redactie/redactie-core';
import React, { FC } from 'react';

import { AutoSubmit } from '../../components';
import { ContentTypesCCNewRouteProps } from '../../contentTypes.types';

const ContentTypesCCConfig: FC<ContentTypesCCNewRouteProps> = ({ fieldTypeData, onSubmit }) => {
	/**
	 * Methods
	 */
	const formsAPI = Core.modules.getModuleAPI('forms-module') as FormsAPI;

	// TODO: replace this with actual validation schema (fieldTypeData.validationSchema)
	const validationSchema = {
		$schema: 'http://json-schema.org/draft-07/schema#',
		type: 'object',
		properties: {},
	};

	const parsedFormSchema: FormSchema = {
		fields:
			fieldTypeData?.formSchema.fields.map(
				(field): FieldSchema => ({
					name: field.name,
					module: field.fieldType?.data?.module,
					label: field.label,
					type: field.fieldType?.data?.componentName,
					config: field.config,
					dataType: 'string',
				})
			) || [],
	};

	const onFormSubmit = (data: any): void => {
		onSubmit({ config: data });
	};

	/**
	 * Render
	 */
	if (!formsAPI || parsedFormSchema.fields.length === 0) {
		return <p>Er zijn geen configuratie mogelijkheden</p>;
	}

	return (
		<formsAPI.Form
			schema={parsedFormSchema}
			validationSchema={validationSchema}
			errorMessages={{}}
			onSubmit={onFormSubmit}
		>
			{({ initialValues, submitForm, values }) => (
				<AutoSubmit initialValues={initialValues} submitForm={submitForm} values={values} />
			)}
		</formsAPI.Form>
	);
};

export default ContentTypesCCConfig;
