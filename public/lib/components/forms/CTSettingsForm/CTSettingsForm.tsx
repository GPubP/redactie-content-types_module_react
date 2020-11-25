import { Button, Textarea, TextField } from '@acpaas-ui/react-components';
import { ErrorMessage } from '@redactie/utils';
import { Field, Formik, isFunction } from 'formik';
import React, { FC } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';
import { getFieldState } from '../../../helpers/forms';

import { CT_SETTINGS_VALIDATION_SCHEMA } from './CTSettingsForm.const';
import { CTSettingsFormChildrenFn, CTSettingsFormProps } from './CTSettingsForm.types';

const CTSettingsForm: FC<CTSettingsFormProps> = ({
	children,
	contentType,
	disabled = false,
	isUpdate = false,
	formikRef,
	onSubmit,
}) => {
	/**
	 * Hooks
	 */

	const [t] = useCoreTranslation();

	/**
	 * Render
	 */

	return (
		<Formik
			innerRef={instance => isFunction(formikRef) && formikRef(instance)}
			initialValues={contentType}
			onSubmit={onSubmit}
			validationSchema={CT_SETTINGS_VALIDATION_SCHEMA}
		>
			{formikProps => {
				const { errors, touched, values } = formikProps;

				return (
					<>
						<div className="row">
							<div className="col-xs-12 col-md-8 row middle-xs">
								<div className="col-xs-12 col-md-8">
									<Field
										as={TextField}
										description="Geef het content type een korte en duidelijke naam."
										disabled={disabled}
										id="meta.label"
										label="Naam"
										name="meta.label"
										required
										state={getFieldState(touched, errors, 'meta.label')}
									/>
									<ErrorMessage
										className="u-text-danger u-margin-top-xs"
										component="p"
										name="meta.label"
									/>
								</div>
							</div>
						</div>
						<div className="row u-margin-bottom-lg">
							<div className="col-xs-12 u-margin-top">
								<Field
									as={Textarea}
									disabled={disabled}
									id="meta.description"
									label="Beschrijving"
									name="meta.description"
									required
									state={getFieldState(touched, errors, 'meta.description')}
								/>
								<small className="u-block u-text-light u-margin-top-xs">
									Geef het content type een duidelijke beschrijving voor in het
									overzicht.
								</small>
								<ErrorMessage
									className="u-text-danger u-margin-top-xs"
									component="p"
									name="meta.description"
								/>
							</div>
						</div>
						{values.uuid && (
							<div className="row u-margin-top">
								<div className="col-xs-12 ">
									<label>UUID</label>
									<p className="u-margin-top-xs">
										<span className="u-text-light u-margin-right-xs">
											{values.uuid}
										</span>
										<CopyToClipboard text={values.uuid}>
											<Button
												className="u-button-as-link"
												htmlType="button"
												type="transparent"
											>
												{t(CORE_TRANSLATIONS.GENERAL_COPY)}
											</Button>
										</CopyToClipboard>
									</p>
								</div>
							</div>
						)}
						{typeof children === 'function'
							? (children as CTSettingsFormChildrenFn)(formikProps)
							: children}
					</>
				);
			}}
		</Formik>
	);
};

export default CTSettingsForm;
