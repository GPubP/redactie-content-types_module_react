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
	if (!formsAPI || !fieldData?.validators.length) {
		return <p>Er zijn geen validatie mogelijkheden</p>;
	}

	// TODO: show validation schema based on validators property
	// return (
	// 	<formsAPI.Form
	// 		schema={}
	// 		validationSchema={validationSchema}
	// 		errorMessages={{}}
	// 	/>
	// );

	return <p>Er zijn geen validatie mogelijkheden</p>;
};

export default ContentTypesCCValidation;
