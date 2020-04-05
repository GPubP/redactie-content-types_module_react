import { FormsAPI } from '@redactie/form-renderer-module';
import Core from '@redactie/redactie-core';
import React, { FC } from 'react';

import { ContentTypesCCFormProps } from './ContentTypesCCForm.types';

const ContentTypesCCForm: FC<ContentTypesCCFormProps> = ({ fieldData }) => {
	const formsAPI = Core.modules.getModuleAPI('forms-module') as FormsAPI;

	if (!formsAPI || !fieldData) {
		return null;
	}

	return <formsAPI.Form schema={fieldData.formSchema} validationSchema={{}} errorMessages={{}} />;
};

export default ContentTypesCCForm;
