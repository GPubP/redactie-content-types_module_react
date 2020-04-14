import React, { FC } from 'react';

import { FormCCSettings } from '../../components';
import { generateCCFormState } from '../../contentTypes.helpers';
import { CCSettingsFormState, ContentTypesCCNewRouteProps } from '../../contentTypes.types';

const ContentTypesCCSettings: FC<ContentTypesCCNewRouteProps> = ({ CTField, onSubmit }) => {
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
