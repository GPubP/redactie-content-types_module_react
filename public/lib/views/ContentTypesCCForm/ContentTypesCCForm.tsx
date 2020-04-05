import { FormsAPI } from '@redactie/form-renderer-module';
import Core from '@redactie/redactie-core';
import React, { FC } from 'react';

import { ContentTypesCCFormProps } from './ContentTypesCCForm.types';

const ContentTypesCCForm: FC<ContentTypesCCFormProps> = ({ formData }) => {
	const formsAPI = Core.modules.getModuleAPI('forms-module') as FormsAPI;

	if (!formsAPI || !formData) {
		return null;
	}

	return <formsAPI.Form schema={formData.formSchema} validationSchema={{}} errorMessages={{}} />;
};

export default ContentTypesCCForm;
