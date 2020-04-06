import { FormsAPI } from '@redactie/form-renderer-module';
import Core from '@redactie/redactie-core';
import React, { FC } from 'react';

import { ContentTypesCCValidationProps } from './ContentTypesCCValidation.types';

const ContentTypesCCValidation: FC<ContentTypesCCValidationProps> = ({ fieldData }) => {
	console.log(fieldData);

	/**
	 * Methods
	 */
	const formsAPI = Core.modules.getModuleAPI('forms-module') as FormsAPI;

	const validationSchema = {
		$schema: 'http://json-schema.org/draft-07/schema#',
		type: 'object',
		properties: {},
	};

	/**
	 * Render
	 */

	if (!formsAPI || !fieldData?.formSchema) {
		return null;
	}

	// return (
	// 	<formsAPI.Form
	// 		schema={}
	// 		validationSchema={validationSchema}
	// 		errorMessages={{}}
	// 	/>
	// );

	return null;
};

export default ContentTypesCCValidation;
