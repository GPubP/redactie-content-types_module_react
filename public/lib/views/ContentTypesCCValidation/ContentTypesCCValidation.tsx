import { FormsAPI } from '@redactie/form-renderer-module';
import Core from '@redactie/redactie-core';
import React, { FC, ReactElement } from 'react';

import { ContentTypesCCValidationProps } from './ContentTypesCCValidation.types';

const ContentTypesCCValidation: FC<ContentTypesCCValidationProps> = ({ fieldData }) => {
	/**
	 * Methods
	 */
	const formsAPI = Core.modules.getModuleAPI('forms-module') as FormsAPI;

	/**
	 * Render
	 */
	const validationSchema = {
		$schema: 'http://json-schema.org/draft-07/schema#',
		type: 'object',
		properties: {},
	};

	const renderCCValidation = (): ReactElement => {
		if (!formsAPI || !fieldData?.validators.length) {
			return <p>Er zijn geen validatie mogelijkheden</p>;
		}
		// TODO: show validation schema based on validators property
		return (
			<formsAPI.Form
				schema={{ fields: [] }}
				validationSchema={validationSchema}
				errorMessages={{}}
			/>
		);
	};

	return (
		<>
			<h6 className="u-margin-bottom">Validatie</h6>
			{renderCCValidation()}
		</>
	);
};

export default ContentTypesCCValidation;
