import React, { FC } from 'react';

import { FormCCSettings } from '../../components';

import { ContentTypesCCSettingsProps } from './ContentTypesCCSettings.types';

const ContentTypesCCSettings: FC<ContentTypesCCSettingsProps> = ({ fieldFormState, onSubmit }) => {
	/**
	 * Render
	 */
	return (
		<FormCCSettings
			initialValues={fieldFormState}
			onSubmit={(data: any) => {
				onSubmit(data);
			}}
		/>
	);
};

export default ContentTypesCCSettings;
