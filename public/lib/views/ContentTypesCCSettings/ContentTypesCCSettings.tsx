import React, { FC } from 'react';

import { FormCCSettings } from '../../components';
import { generateCCFormState } from '../../contentTypes.helpers';
import { CCSettingsFormState, ContentTypesCCRouteProps } from '../../contentTypes.types';

const ContentTypesCCSettings: FC<ContentTypesCCRouteProps> = ({ CTField, onDelete, onSubmit }) => {
	/**
	 * Render
	 */
	return (
		<FormCCSettings
			initialValues={generateCCFormState(CTField)}
			onSubmit={(data: CCSettingsFormState) => {
				onSubmit(data);
			}}
		/>
	);
};

export default ContentTypesCCSettings;
