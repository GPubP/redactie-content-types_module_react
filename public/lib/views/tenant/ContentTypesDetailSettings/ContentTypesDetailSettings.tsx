import { Button } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { LeavePrompt, useDetectValueChanges } from '@redactie/utils';
import React, { FC, useMemo, useState } from 'react';

import { CTSettingsForm } from '../../../components';
import { useCoreTranslation } from '../../../connectors/translations';
import { CONTENT_TYPE_DETAIL_TAB_MAP } from '../../../contentTypes.const';
import { ContentTypesDetailRouteProps, LoadingState } from '../../../contentTypes.types';
import { useContentType } from '../../../hooks';
import { ContentTypeDetailModel } from '../../../store/contentTypes';

const ContentTypeSettings: FC<ContentTypesDetailRouteProps> = ({
	allowedPaths,
	onCancel,
	onSubmit,
	contentType,
}) => {
	const isUpdate = !!contentType.uuid;

	/**
	 * Hooks
	 */
	const [t] = useCoreTranslation();
	const [, contentTypIsUpdating] = useContentType();
	const isLoading = useMemo(() => {
		return contentTypIsUpdating === LoadingState.Loading;
	}, [contentTypIsUpdating]);
	const [formValue, setFormValue] = useState<ContentTypeDetailModel | null>(null);
	const [hasChanges, resetChangeDetection] = useDetectValueChanges(!isLoading, formValue);

	/**
	 * Methods
	 */
	const onFormSubmit = (value: ContentTypeDetailModel | null): void => {
		if (!value) {
			return;
		}

		onSubmit({ ...contentType?.meta, ...value.meta }, CONTENT_TYPE_DETAIL_TAB_MAP.settings);
		resetChangeDetection();
	};

	/**
	 * Render
	 */

	return (
		<CTSettingsForm contentType={contentType} isUpdate={isUpdate} onSubmit={onFormSubmit}>
			{({ submitForm, values }) => {
				setFormValue(values);

				return (
					<>
						<ActionBar className="o-action-bar--fixed" isOpen>
							<ActionBarContentSection>
								<div className="u-wrapper row end-xs">
									<Button onClick={onCancel} negative>
										{isUpdate ? t(CORE_TRANSLATIONS['BUTTON_CANCEL']) : 'Terug'}
									</Button>
									<Button
										iconLeft={isLoading ? 'circle-o-notch fa-spin' : null}
										disabled={isLoading || !hasChanges}
										className="u-margin-left-xs"
										onClick={() => {
											submitForm();
										}}
										type="success"
									>
										{isUpdate
											? t(CORE_TRANSLATIONS['BUTTON_SAVE'])
											: t(CORE_TRANSLATIONS['BUTTON_SAVE-NEXT'])}
									</Button>
								</div>
							</ActionBarContentSection>
						</ActionBar>
						<LeavePrompt
							allowedPaths={allowedPaths}
							when={hasChanges}
							shouldBlockNavigationOnConfirm
							onConfirm={() => submitForm()}
						/>
					</>
				);
			}}
		</CTSettingsForm>
	);
};

export default ContentTypeSettings;
