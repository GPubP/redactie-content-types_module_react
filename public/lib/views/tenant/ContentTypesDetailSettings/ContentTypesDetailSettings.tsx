import { Button } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { AlertContainer, alertService, LeavePrompt, useDetectValueChanges } from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import { isEmpty } from 'ramda';
import React, { FC, useMemo, useRef, useState } from 'react';

import { CTSettingsForm } from '../../../components';
import { useCoreTranslation } from '../../../connectors/translations';
import { ALERT_CONTAINER_IDS, CONTENT_TYPE_DETAIL_TAB_MAP } from '../../../contentTypes.const';
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
	const [, contentTypeIsUpdating, contentTypeIsCreating] = useContentType();
	const formikRef = useRef<FormikProps<FormikValues>>();
	const isLoading = useMemo(() => {
		return isUpdate
			? contentTypeIsUpdating === LoadingState.Loading
			: contentTypeIsCreating === LoadingState.Loading;
	}, [contentTypeIsCreating, contentTypeIsUpdating, isUpdate]);
	const [formValue, setFormValue] = useState<ContentTypeDetailModel | null>(null);
	const [hasChanges, resetChangeDetection] = useDetectValueChanges(!isLoading, formValue);

	/**
	 * Methods
	 */
	const renderDangerAlert = ({
		title = 'Foutmelding',
		message = 'Niet alle velden van het formulier zijn correct ingevuld',
	} = {}): void => {
		alertService.danger(
			{
				title,
				message,
			},
			{
				containerId: ALERT_CONTAINER_IDS.detailSettings,
			}
		);
	};

	const isFormValid = async (): Promise<boolean> => {
		if (!formikRef || !formikRef.current) {
			return false;
		}

		const errors = await formikRef.current.validateForm();

		return isEmpty(errors);
	};

	const beforeSubmit = async (): Promise<boolean> => {
		const isValid = await isFormValid();

		if (!isValid) {
			renderDangerAlert();
		}

		return isValid;
	};

	const onFormSubmit = async (value: ContentTypeDetailModel | null): Promise<void> => {
		if (!value) {
			return renderDangerAlert();
		}

		if (!formikRef || !formikRef.current) {
			return renderDangerAlert({
				message: 'Er is iets fout gelopen. Probeer later opnieuw.',
			});
		}

		if (!(await beforeSubmit())) {
			return;
		}

		onSubmit({ ...contentType?.meta, ...value.meta }, CONTENT_TYPE_DETAIL_TAB_MAP.settings);
		resetChangeDetection();
	};

	/**
	 * Render
	 */
	return (
		<>
			<div className="u-margin-bottom">
				<AlertContainer containerId={ALERT_CONTAINER_IDS.detailSettings} />
			</div>
			<CTSettingsForm
				formikRef={instance => (formikRef.current = instance || undefined)}
				contentType={contentType}
				isUpdate={isUpdate}
				onSubmit={onFormSubmit}
			>
				{({ submitForm, values }) => {
					setFormValue(values);
					const submit = (): void => {
						beforeSubmit();
						submitForm();
					};

					return (
						<>
							<ActionBar className="o-action-bar--fixed" isOpen>
								<ActionBarContentSection>
									<div className="u-wrapper row end-xs">
										<Button onClick={onCancel} negative>
											{isUpdate
												? t(CORE_TRANSLATIONS['BUTTON_CANCEL'])
												: 'Terug'}
										</Button>
										<Button
											iconLeft={isLoading ? 'circle-o-notch fa-spin' : null}
											disabled={isLoading || !hasChanges}
											className="u-margin-left-xs"
											onClick={submit}
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
								onConfirm={submit}
							/>
						</>
					);
				}}
			</CTSettingsForm>
		</>
	);
};

export default ContentTypeSettings;
