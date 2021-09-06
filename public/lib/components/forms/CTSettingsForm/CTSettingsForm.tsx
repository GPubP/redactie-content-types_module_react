import { Textarea, TextField } from '@acpaas-ui/react-components';
import { CopyValue, ErrorMessage } from '@redactie/utils';
import { Field, Formik, isFunction } from 'formik';
import React, { FC } from 'react';

import {
	CORE_TRANSLATIONS,
	useCoreTranslation,
	useModuleTranslation,
} from '../../../connectors/translations';
import { getFieldState } from '../../../helpers/forms';

import { CT_SETTINGS_VALIDATION_SCHEMA } from './CTSettingsForm.const';
import { CTSettingsFormChildrenFn, CTSettingsFormProps } from './CTSettingsForm.types';

const CTSettingsForm: FC<CTSettingsFormProps> = ({
	children,
	contentType,
	disabled = false,
	formikRef,
	translations,
	onSubmit,
}) => {
	/**
	 * Hooks
	 */

	const [t] = useCoreTranslation();
	const [tModule] = useModuleTranslation();

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
									{tModule(translations.SETTINGS_DESCRIPTION_GUIDELINE)}
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
