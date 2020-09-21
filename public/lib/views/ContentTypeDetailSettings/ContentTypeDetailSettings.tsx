import { Button, Textarea, TextField } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { useDetectValueChanges } from '@redactie/utils';
import { Field, Formik } from 'formik';
import kebabCase from 'lodash.kebabcase';
import React, { FC, useMemo, useState } from 'react';

import { useCoreTranslation } from '../../connectors/translations';
import { CONTENT_TYPE_DETAIL_TAB_MAP } from '../../contentTypes.const';
import { ContentTypesDetailRouteProps, LoadingState } from '../../contentTypes.types';
import { getFieldState } from '../../helpers/forms';
import { useContentType } from '../../hooks';
import { ContentTypeDetailModel } from '../../store/contentTypes';

import { CT_SETTINGS_VALIDATION_SCHEMA } from './ContentTypeDetailSettings.const';

const ContentTypeSettings: FC<ContentTypesDetailRouteProps> = ({
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
	const [isChanged] = useDetectValueChanges(!isLoading, formValue);

	/**
	 * Methods
	 */
	const onFormSubmit = (value: ContentTypeDetailModel): void => {
		onSubmit({ ...contentType?.meta, ...value.meta }, CONTENT_TYPE_DETAIL_TAB_MAP.settings);
	};

	/**
	 * Render
	 */

	return (
		<Formik
			initialValues={contentType}
			onSubmit={onFormSubmit}
			validationSchema={CT_SETTINGS_VALIDATION_SCHEMA}
		>
			{({ errors, submitForm, touched, values }) => {
				const labelError = getFieldState(touched, errors, 'meta.label');
				const descriptionError = getFieldState(touched, errors, 'meta.description');
				setFormValue(values);

				return (
					<>
						<div className="row">
							<div className="col-xs-12 col-md-8 row middle-xs">
								<div className="col-xs-12 col-md-8">
									<Field
										as={TextField}
										id="meta.label"
										label="Naam"
										name="meta.label"
										required
										state={labelError}
									/>
									{labelError ? (
										<p className="u-text-danger">{errors.meta?.label}</p>
									) : null}
									<div className="u-text-light u-margin-top-xs">
										Geef het content type een korte en duidelijke naam.
									</div>
								</div>

								<div className="col-xs-12 col-md-4 u-margin-top u-margin-bottom">
									<div>
										{t(CORE_TRANSLATIONS['GENERAL_SYSTEM-NAME'])}:{' '}
										<b>
											{isUpdate
												? contentType.meta.safeLabel
												: kebabCase(values.meta.label)}
										</b>
									</div>
								</div>
							</div>
						</div>
						<div className="row u-margin-bottom-lg">
							<div className="col-xs-12 row middle-xs u-margin-top">
								<div className="col-xs-12">
									<Field
										as={Textarea}
										id="meta.description"
										label="Beschrijving"
										name="meta.description"
										required
										state={descriptionError}
									/>
									{descriptionError ? (
										<p className="u-text-danger">{errors.meta?.description}</p>
									) : null}
									<div className="u-text-light u-margin-top-xs">
										Geef het content type een duidelijke beschrijving voor in
										het overzicht.
									</div>
								</div>
							</div>
						</div>
						<ActionBar className="o-action-bar--fixed" isOpen>
							<ActionBarContentSection>
								<div className="u-wrapper row end-xs">
									<Button onClick={onCancel} negative>
										{isUpdate ? t(CORE_TRANSLATIONS['BUTTON_CANCEL']) : 'Terug'}
									</Button>
									<Button
										iconLeft={isLoading ? 'circle-o-notch fa-spin' : null}
										disabled={isLoading || !isChanged}
										className="u-margin-left-xs"
										onClick={submitForm}
										type="success"
									>
										{isUpdate
											? t(CORE_TRANSLATIONS['BUTTON_SAVE'])
											: t(CORE_TRANSLATIONS['BUTTON_SAVE-NEXT'])}
									</Button>
								</div>
							</ActionBarContentSection>
						</ActionBar>
					</>
				);
			}}
		</Formik>
	);
};

export default ContentTypeSettings;
