import React, { FC } from 'react';

import { FormCCSettings } from '../../components';
import { generateCCFormState } from '../../contentTypes.helpers';
import { CCSettingsFormState, ContentTypesCCNewRouteProps } from '../../contentTypes.types';

const ContentTypesCCSettings: FC<ContentTypesCCNewRouteProps> = ({ fieldTypeData, onSubmit }) => {
	/**
	 * Render
	 */
	return (
		<FormCCSettings
			initialValues={generateCCFormState(fieldTypeData)}
			onSubmit={(data: CCSettingsFormState<boolean>) => {
				onSubmit(data);
			}}
		/>
	);
};

export default ContentTypesCCSettings;
