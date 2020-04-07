import { FormsAPI } from '@redactie/form-renderer-module';
import Core from '@redactie/redactie-core';
import React, { FC } from 'react';

import { ContentTypesCCValidationProps } from './ContentTypesCCValidation.types';

const ContentTypesCCValidation: FC<ContentTypesCCValidationProps> = ({ fieldData }) => {
	/**
	 * Methods
	 */
	const formsAPI = Core.modules.getModuleAPI('forms-module') as FormsAPI;

	/**
	 * Render
	 */
	if (!formsAPI || !fieldData?.formSchema) {
		return <p>Er zijn geen validatie mogelijkheden</p>;
	}

	// return (
	// 	<formsAPI.Form
	// 		schema={}
	// 		validationSchema={validationSchema}
	// 		errorMessages={{}}
	// 	/>
	// );

	// TODO: show validation schema
	return <p>Er zijn geen validatie mogelijkheden</p>;
};

export default ContentTypesCCValidation;
