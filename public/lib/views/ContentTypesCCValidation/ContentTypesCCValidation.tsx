import { FormsAPI } from '@redactie/form-renderer-module';
import Core from '@redactie/redactie-core';
import React, { FC, ReactElement } from 'react';

import { ContentTypesCCValidationProps } from './ContentTypesCCValidation.types';

const ContentTypesCCValidation: FC<ContentTypesCCValidationProps> = ({ fieldData, preset }) => {
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
		console.log(preset, 'preset');
		if (!formsAPI || !fieldData?.validators.length) {
			return <p>Er zijn geen validatie mogelijkheden</p>;
		}

		// CREATE FORM FROM PRESET ----------------------------
		// loop door alle fields in preset
		// neem de field name onder het fields object => '[fieldName].[validatorKey]'
		// maak een veldgroup aan van elk veld dat een validation object heeft
		// create initial state
		// create validation schema

		/**
		 * Example: Initial form state
		 *
		 * {
		 * 		[fieldName]: {
		 * 			[validatorName]: [validatorValue],
		 * 			[validatorName]: [validatorValue]
		 *          [validatorName]: {
		 * 				val: "",
		 * 				err: "",
		 * 			}
		 * 		},
		 * 		[fieldName]: {
		 * 			[validatorName]: [validatorValue],
		 * 			[validatorName]: [validatorValue]
		 * 		}
		 * }
		 */

		// SAVE FORM -------------------------------------------
		// - Zet de validatie config voor elke veld aan de hand van de form data, validator en het DataType
		// - save field

		/**
		 *
		 * fields: [
		 * 	{
		 * 		uuid: string;
		 * 		_id: string;
		 * 		label: string;
		 * 		name: string;
		 * 		operators: [{
		 * 			_id: string;
		 * 			value: string;
		 * 			label: string;
		 * 		}];
		 * 		dataType: string;
		 * 		fieldType: string;
		 * 		config: {},
		 * 		validation: {
		 * 			type: string;
		 * 			checks: [{
		 * 				key: '',
		 * 				value: '',
		 * 				error: ''
		 * 			}]
		 * 		},
		 * 		generalConfig: {
		 * 			required: boolean;
		 * 			min: number;
		 * 			max: number;
		 * 			hidden: boolean;
		 * 			multilanguage: boolean;
		 * 		},
		 * 		defaultValue: any;
		 *  }
		 * ]
		 */

		/**
		 *
		 */

		// TODO: show validation schema based on validators property
		//

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
