import { FieldOption, InputFieldProps } from '@redactie/form-renderer-module';
import React, { ReactElement, useEffect, useMemo } from 'react';

import formRendererConnector from '../../../connectors/formRenderer';
import { LoadingState } from '../../../contentTypes.types';
import { useContentTypes } from '../../../hooks';
import { contentTypesFacade } from '../../../store/contentTypes';
import DataLoader from '../../DataLoader/DataLoader';

const ContentTypesSelect: React.FC<InputFieldProps> = ({
	fieldSchema,
	fieldProps,
	fieldHelperProps,
}: InputFieldProps) => {
	/**
	 * HOOKS
	 */
	// const [t] = useCoreTranslation();
	const [ContentTypesLoadingState, contentTypes] = useContentTypes();
	const contentTypeOptions: FieldOption[] = useMemo(() => {
		if (ContentTypesLoadingState !== LoadingState.Loaded || !contentTypes) {
			return [];
		}

		return contentTypes.map(
			ct =>
				({
					value: ct._id,
					key: ct._id,
					label: ct.meta.label,
				} as FieldOption)
		);
	}, [ContentTypesLoadingState, contentTypes]);

	useEffect(() => {
		contentTypesFacade.getContentTypes({ limit: -1, skip: 0 });
	}, []);

	/**
	 * FORM COMPONENT FETCH
	 */
	const CheckBoxList = formRendererConnector.api.fieldRegistry.get('core', 'checkboxList')
		?.component;

	if (!CheckBoxList) {
		return null;
	}

	const renderCheckboxList = (): ReactElement => (
		<>
			<CheckBoxList
				fieldSchema={{
					...fieldSchema,
					config: {
						...(fieldSchema.config || {}),
						options: contentTypeOptions,
					},
				}}
				fieldHelperProps={fieldHelperProps}
				fieldProps={fieldProps}
			></CheckBoxList>
		</>
	);

	return <DataLoader loadingState={ContentTypesLoadingState} render={renderCheckboxList} />;
};

export default ContentTypesSelect;
