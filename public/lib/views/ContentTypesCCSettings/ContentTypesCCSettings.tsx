import React, { FC } from 'react';

import { FormCCSettings } from '../../components';
import { generateCCFormState } from '../../contentTypes.helpers';
import { CCSettingsFormState, ContentTypesCCNewRouteProps } from '../../contentTypes.types';

const ContentTypesCCSettings: FC<ContentTypesCCNewRouteProps> = ({ fieldTypeData, onSubmit }) => {
	const { label, name, componentName, dataType } = fieldTypeData;

	/**
	 * Render
	 */
	return (
		<FormCCSettings
			initialValues={generateCCFormState({ label, name, componentName, dataType })}
			onSubmit={(data: CCSettingsFormState<boolean>) => {
				onSubmit(data);
			}}
		/>
	);
};

export default ContentTypesCCSettings;
