import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import { SiteResponse } from '@redactie/sites-module';
import {
	AlertContainer,
	alertService,
	DataLoader,
	DeletePrompt,
	FormikOnChangeHandler,
	LeavePrompt,
	LoadingState,
	useDetectValueChangesWorker,
} from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import { isEmpty } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { CTSettingsForm } from '../../../components';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';
import { ALERT_CONTAINER_IDS, CONTENT_TYPE_DETAIL_TAB_MAP } from '../../../contentTypes.const';
import {
	ContentTypesDetailRouteProps,
	ContentTypesRouteParams,
	CtTypes,
} from '../../../contentTypes.types';
import { useContentType } from '../../../hooks';
import { MODULE_TRANSLATIONS } from '../../../i18next/translations.const';
import { ContentTypeDetailModel, contentTypesFacade } from '../../../store/contentTypes';

const ContentTypeSettings: FC<ContentTypesDetailRouteProps> = ({
	allowedPaths,
	onCancel,
	onSubmit,
	onDelete,
	contentType,
}) => {
	const isUpdate = !!contentType.uuid;

	/**
	 * Hooks
	 */
	const [t] = useCoreTranslation();
	const { ctType } = useParams<ContentTypesRouteParams>();
	const {
		updatingState: contentTypeIsUpdating,
		creatingState: contentTypeIsCreating,
		removingState: contentTypeisRemoving,
		isFetchingSiteOccurrencesState,
		siteOccurrences,
	} = useContentType();
	const formikRef = useRef<FormikProps<FormikValues>>();
	const isLoading = useMemo(() => {
		return isUpdate
			? contentTypeIsUpdating === LoadingState.Loading
			: contentTypeIsCreating === LoadingState.Loading;
	}, [contentTypeIsCreating, contentTypeIsUpdating, isUpdate]);
	const [formValue, setFormValue] = useState<ContentTypeDetailModel | null>(contentType ?? null);
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [hasChanges, resetChangeDetection] = useDetectValueChangesWorker(
		!isLoading,
		formValue,
		BFF_MODULE_PUBLIC_PATH
	);
	const TYPE_TRANSLATIONS = MODULE_TRANSLATIONS[ctType];
	const isRemovable = useMemo(() => Array.isArray(siteOccurrences) && !siteOccurrences.length, [
		siteOccurrences,
	]);

	useEffect(() => {
		if (!contentType?.uuid) {
			return;
		}

		contentTypesFacade.getContentTypeSiteOccurrences(contentType.uuid);
	}, [contentType]);

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

	const renderDelete = (): ReactElement => {
		if (!onDelete) {
			return <></>;
		}

		return (
			<Card className="u-margin-top">
				<CardBody>
					<h6>Verwijderen</h6>
					{isRemovable ? (
						<p className="u-margin-top-xs u-margin-bottom">
							Opgelet, indien u dit{' '}
							{ctType === CtTypes.contentTypes ? 'content type' : 'content blok'}{' '}
							verwijdert kan deze niet meer gebruikt worden op sites.
						</p>
					) : (
						<p className="u-margin-top-xs u-margin-bottom">
							Het {ctType === CtTypes.contentTypes ? 'content type' : 'content blok'}{' '}
							is actief op <b>{siteOccurrences?.length}</b> sites waardoor deze niet
							kan verwijderd worden. Deactiveer het content-type voor alle sites om
							alsnog het content-type te verwijderen
						</p>
					)}
					{!isRemovable && siteOccurrences && (
						<ul>
							{siteOccurrences.map((occurrence: SiteResponse, index: number) => (
								<li key={`${index}_${occurrence.uuid}`}>{occurrence.data.name}</li>
							))}
						</ul>
					)}
					<Button
						iconLeft="trash-o"
						onClick={() => isRemovable && setShowDeleteModal(true)}
						type="danger"
						disabled={!isRemovable}
					>
						Verwijderen
					</Button>
				</CardBody>
			</Card>
		);
	};

	return (
		<>
			<AlertContainer
				toastClassName="u-margin-bottom"
				containerId={ALERT_CONTAINER_IDS.detailSettings}
			/>
			<CTSettingsForm
				formikRef={instance => (formikRef.current = instance || undefined)}
				contentType={contentType}
				translations={TYPE_TRANSLATIONS}
				isUpdate={isUpdate}
				onSubmit={onFormSubmit}
				ctType={ctType}
			>
				{({ submitForm }) => {
					const submit = (): void => {
						beforeSubmit();
						submitForm();
					};

					return (
						<>
							<FormikOnChangeHandler
								onChange={values => setFormValue(values as ContentTypeDetailModel)}
							/>
							{contentType?.uuid && (
								<DataLoader
									loadingState={isFetchingSiteOccurrencesState}
									render={renderDelete}
								/>
							)}
							<ActionBar className="o-action-bar--fixed" isOpen>
								<ActionBarContentSection>
									<div className="u-wrapper u-text-right">
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
							<DeletePrompt
								body="Ben je zeker dat je dit content type wil verwijderen? Dit kan niet ongedaan gemaakt worden."
								isDeleting={contentTypeisRemoving === LoadingState.Loading}
								show={showDeleteModal}
								onCancel={() => setShowDeleteModal(false)}
								onConfirm={() => isRemovable && onDelete && onDelete()}
							/>
						</>
					);
				}}
			</CTSettingsForm>
		</>
	);
};

export default ContentTypeSettings;
