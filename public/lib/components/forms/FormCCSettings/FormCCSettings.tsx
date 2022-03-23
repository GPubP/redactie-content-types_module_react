import {
	Checkbox,
	RadioGroup,
	Textarea,
	TextField,
	Card,
	CardBody,
} from '@acpaas-ui/react-components';
import { CopyValue, FormikOnChangeHandler } from '@redactie/utils';
import { ErrorMessage, Field, Formik } from 'formik';
import kebabCase from 'lodash.kebabcase';
import { equals } from 'ramda';
import React, { ChangeEvent, FC, useState } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';
import { CCSettingsFormState } from '../../../contentTypes.types';
import { getFieldState } from '../../../helpers/forms';

import { FORM_CC_SETTINGS_VALIDATION_SCHEMA, IS_MULTIPLE_OPTIONS } from './FormCCSettings.const';
import { FormCCSettingsProps } from './FormCCSettings.types';

const FormCCSettings: FC<FormCCSettingsProps> = ({
	initialValues,
	fieldTypeData,
	onSubmit,
	isUpdate,
	formikRef,
}) => {
	const [isMultiple, setIsMultiple] = useState((initialValues?.generalConfig?.max || 0) > 1);
	const [isTranslatable, setIsTranslatable] = useState<boolean>(
		(fieldTypeData.generalConfig.isTranslatable) || false
	);
	const [t] = useCoreTranslation();

	const onFormSubmit = (values: CCSettingsFormState): void => {
		const hiddenIsChanged = !equals(
			initialValues.generalConfig.hidden,
			values.generalConfig.hidden
		);

		onSubmit({
			...values,
			generalConfig: {
				...values.generalConfig,
				// Disable the content component when it is hidden
				// The value of a hidden content component can not change when it is hidden
				disabled:
					hiddenIsChanged && values.generalConfig.hidden
						? !!values.generalConfig.hidden
						: !!initialValues.generalConfig.disabled,
				// Reset min and max to initial values if not muliple
				min: isMultiple ? values.generalConfig.min : 0,
				max: isMultiple ? values.generalConfig.max : 1,
			},
		});
	};

	const translatable = (): void => {
		setIsTranslatable(!isTranslatable);
	};

	return (
		<Formik
			innerRef={formikRef}
			enableReinitialize
			initialValues={initialValues}
			onSubmit={onFormSubmit}
			validationSchema={FORM_CC_SETTINGS_VALIDATION_SCHEMA}
		>
			{({ errors, touched, values, submitForm }) => {
				return (
					<>
						<FormikOnChangeHandler
							onChange={values => onFormSubmit(values as CCSettingsFormState)}
						/>
						<div className="row">
							<div className="col-xs-12 row middle-xs">
								<div className="col-xs-12 col-md-8">
									<Field
										as={TextField}
										description="Geef deze content component een gebruiksvriendelijke naam, bijvoorbeeld 'Titel'."
										id="label"
										label="Label"
										name="label"
										placeholder="Typ een label"
										required
										state={getFieldState(touched, errors, 'label')}
									/>
									<ErrorMessage
										className="u-text-danger u-margin-top-xs"
										component="p"
										name="label"
									/>
								</div>

								<div className="col-xs-12 col-md-4 u-margin-top-xs u-margin-bottom">
									<div>
										{t(CORE_TRANSLATIONS['GENERAL_SYSTEM-NAME'])}:{' '}
										<b>
											{isUpdate
												? initialValues?.name
												: kebabCase(values.label)}
										</b>
									</div>
								</div>
							</div>
						</div>
						<div className="row u-margin-top">
							<div className="col-xs-12">
								<Field
									as={Textarea}
									id="generalConfig.guideline"
									label="Richtlijn (optioneel)"
									name="generalConfig.guideline"
								/>
								<small className="u-block u-text-light u-margin-top-xs">
									Geef de redacteur een richtlijn voor het ingeven van deze
									content component.
								</small>
							</div>
						</div>
						{fieldTypeData.generalConfig.isMultiple ? (
							<div className="row u-margin-top">
								<div className="col-xs-12">
									<RadioGroup
										description="Bepaal hoeveel items van deze content component aangemaakt kunnen worden"
										id="isMultiple"
										name="isMultiple"
										onChange={(e: ChangeEvent<HTMLInputElement>) => {
											setIsMultiple(e.target.value === 'true');
											submitForm();
										}}
										options={IS_MULTIPLE_OPTIONS}
										value={String(isMultiple)}
									/>
									{isMultiple && (
										<div className="row u-margin-top">
											<div className="col-xs-2">
												<Field
													as={TextField}
													type="number"
													id="generalConfig.min"
													min="0"
													max={values.generalConfig.max}
													label="Min."
													name="generalConfig.min"
												/>
											</div>
											<div className="col-xs-2">
												<Field
													as={TextField}
													type="number"
													id="generalConfig.max"
													label="Max."
													min={values.generalConfig.min + 1}
													max="100"
													name="generalConfig.max"
												/>
											</div>
										</div>
									)}
								</div>
							</div>
						) : null}
						<div className="row u-margin-top">
							<div className="col-xs-12">
								<Field
									as={Checkbox}
									checked={values.generalConfig.hidden}
									id="generalConfig.hidden"
									name="generalConfig.hidden"
									label="Verborgen"
								/>
								<small className="u-block u-text-light">
									Bepaal of deze content component zichtbaar mag zijn. Opgelet:
									content componenten die een standaard waarde krijgen en als
									&apos;niet aanpasbaar&apos; zijn ingesteld, worden onzichtbaar
									voor de redacteur.
								</small>
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
						<div className="u-margin-top u-margin-bottom">
						<Card>
							<CardBody>
								<h6>Vertalen</h6>
								<p className="u-margin-top u-margin-bottom">
									{fieldTypeData.generalConfig.isTranslatable
										? 'Bepaal of er voor deze component andere inhoud kan ingegeven worden per taal. Zoniet blijft de inhoud over de talen heen gelijk.'
										: 'Voor deze component kan er geen andere inhoud ingegeven worden per taal. De inhoud blijft over de talen heen gelijk.'}
								</p>

									<Field
										checked={isTranslatable}
										disabled={!fieldTypeData.generalConfig.isTranslatable}
										onChange={translatable}
										id="fieldTypeData.generalConfig.isTranslatable"
										name="fieldTypeData.generalConfig.isTranslatable"
										label="Inhoud vertalen"
									/>


							</CardBody>
						</Card>
						</div>

					</>
				);
			}}
		</Formik>
	);
};

export default FormCCSettings;
