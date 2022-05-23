import { RadioGroup, Textarea, TextField } from '@acpaas-ui/react-components';
import { CopyValue, ErrorMessage } from '@redactie/utils';
import { Field, Formik, isFunction } from 'formik';
import { path } from 'ramda';
import React, { FC, useMemo } from 'react';

import {
	CORE_TRANSLATIONS,
	useCoreTranslation,
	useModuleTranslation,
} from '../../../connectors/translations';
import { getFieldState } from '../../../helpers/forms';
import { ContentTypeDetailModel } from '../../../store/contentTypes';

import {
	CT_SETTINGS_VALIDATION_SCHEMA,
	ISSUED_EDITABLE_OPTIONS,
	ISSUED_PREFILL_OPTIONS,
} from './CTSettingsForm.const';
import { CTSettingsFormChildrenFn, CTSettingsFormProps } from './CTSettingsForm.types';

const CTSettingsForm: FC<CTSettingsFormProps> = ({
	children,
	contentType,
	disabled = false,
	formikRef,
	translations,
	onSubmit,
	renderUrlPattern = false,
}) => {
	const initialValues: ContentTypeDetailModel = {
		...contentType,
		meta: {
			...contentType.meta,
			issuedOnPrefill: contentType.meta?.issuedOnPrefill || ISSUED_PREFILL_OPTIONS[0].value,
			issuedOnEditable: contentType.meta?.issuedOnEditable || false,
		},
	};

	/**
	 * Hooks
	 */

	const [t] = useCoreTranslation();
	const [tModule] = useModuleTranslation();
	const IssuedEditableOptions = useMemo(
		() => ISSUED_EDITABLE_OPTIONS.map(option => ({ ...option, disabled })),
		[disabled]
	);
	const IssuedPrefillOptions = useMemo(
		() => ISSUED_PREFILL_OPTIONS.map(option => ({ ...option, disabled })),
		[disabled]
	);

	/**
	 * Render
	 */

	return (
		<Formik
			innerRef={instance => isFunction(formikRef) && formikRef(instance)}
			initialValues={initialValues}
			onSubmit={onSubmit}
			validationSchema={CT_SETTINGS_VALIDATION_SCHEMA(renderUrlPattern)}
		>
			{formikProps => {
				const { errors, touched, values, setFieldValue } = formikProps;

				if (
					!path(['meta', 'urlPath', 'pattern'], touched) &&
					!values.meta?.urlPath?.pattern &&
					renderUrlPattern
				) {
					setFieldValue('meta.urlPath.pattern', '/[item:slug]');
				}

				return (
					<>
						<div className="row">
							<div className="col-xs-12 col-md-8 row middle-xs">
								<div className="col-xs-12 col-md-8">
									<Field
										as={TextField}
										description={tModule(translations.SETTINGS_NAME_GUIDELINE)}
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
						<div className="row">
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
									{tModule(translations.SETTINGS_DESCRIPTION_GUIDELINE)}
								</small>
								<ErrorMessage
									className="u-text-danger u-margin-top-xs"
									component="p"
									name="meta.description"
								/>
							</div>
						</div>
						{renderUrlPattern && (
							<div className="row">
								<div className="col-xs-12 u-margin-top">
									<Field
										as={TextField}
										disabled={disabled}
										id="meta.urlPath.pattern"
										label="Url patroon"
										name="meta.urlPath.pattern"
										required
										state={getFieldState(
											touched,
											errors,
											'meta.urlPath.pattern'
										)}
									/>
									<small className="u-block u-text-light u-margin-top-xs">
										Voorzie een pad dat voor de slug geplaatst moet worden
									</small>
									<ErrorMessage
										className="u-text-danger u-margin-top-xs"
										component="p"
										name="meta.urlPath.pattern"
									/>
								</div>
							</div>
						)}
						<div className="row">
							<div className="col-xs-12 u-margin-top">
								<Field
									as={RadioGroup}
									id="meta.issuedOnPrefill"
									name="meta.issuedOnPrefill"
									options={IssuedPrefillOptions}
									label={tModule(translations.SETTINGS_ISSUED_ON_PREFILL)}
								/>
							</div>
						</div>
						<div className="row u-margin-bottom-lg">
							<div className="col-xs-12 u-margin-top">
								<Field
									as={RadioGroup}
									id="meta.issuedOnEditable"
									name="meta.issuedOnEditable"
									options={IssuedEditableOptions}
									label={tModule(translations.SETTINGS_ISSUED_ON_EDITABLE)}
								/>
							</div>
						</div>
						{values.uuid && (
							<div className="row u-margin-top">
								<CopyValue
									label="UUID"
									value={values.uuid}
									buttonText={t(CORE_TRANSLATIONS.GENERAL_COPY)}
									className="col-xs-12"
								/>
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
