import { Checkbox, RadioGroup, Textarea, TextField } from '@acpaas-ui/react-components';
import { Field, Formik } from 'formik';
import kebabCase from 'lodash.kebabcase';
import React, { FC } from 'react';

import AutoSubmit from '../AutoSubmit/AutoSubmit';

import { IS_MULTIPLE_OPTIONS } from './FormCCSettings.const';
import { FormCCSettingsProps } from './FormCCSettings.types';

const FormCCSettings: FC<FormCCSettingsProps> = ({ initialValues, onSubmit }) => {
	return (
		<Formik initialValues={initialValues} onSubmit={formValues => onSubmit(formValues)}>
			{({ values }) => {
				return (
					<>
						<AutoSubmit />
						<h6>Instellingen</h6>
						<div className="row u-margin-top">
							<div className="col-xs-12 row middle-xs">
								<div className="col-xs-12 col-md-8">
									<Field
										as={TextField}
										label="Label"
										name="label"
										placeholder="Typ een label"
									/>
									<div className="u-text-light u-margin-top-xs">
										Geef deze content component een gebruiksvriendelijke naam,
										bijvoorbeeld &apos;Titel&apos;.
									</div>
								</div>

								<div className="col-xs-12 col-md-4 u-margin-top-xs u-margin-bottom">
									<div>
										Systeemnaam: <b>{kebabCase(values.label)}</b>
									</div>
								</div>
							</div>
						</div>
						<div className="row u-margin-top">
							<div className="col-xs-12">
								<Field
									as={Textarea}
									label="Richtlijn (optioneel)"
									name="config.guideline"
								/>
								<div className="u-text-light u-margin-top-xs">
									Geef de redacteur een richtlijn voor het ingeven van deze
									content component.
								</div>
							</div>
						</div>
						<div className="row u-margin-top">
							<div className="col-xs-12">
								<Field
									as={RadioGroup}
									name="generalConfig.isMultiple"
									options={IS_MULTIPLE_OPTIONS}
								/>
								<div className="u-text-light u-margin-top-xs">
									Bepaal hoeveel items van dit component er aangemaakt kunnen
									worden
								</div>
							</div>
						</div>
						<div className="row u-margin-top">
							<div className="col-xs-12">
								<Field
									as={Checkbox}
									checked={values.generalConfig.hidden}
									name="generalConfig.isQueryable"
									label="Verborgen"
								/>
								<div className="u-text-light">
									Bepaal of deze content component zichtbaar mag zijn. Opgelet,
									content componenten die een standaard waarde krijgen en als
									&apos;niet aanpasbaar&apos; worden ingesteld worden onzichtbaar
									voor de redacteur.
								</div>
							</div>
						</div>
						<div className="row u-margin-top">
							<div className="col-xs-12">
								<Field
									as={Checkbox}
									checked={values.generalConfig.required}
									name="generalConfig.isTranslate"
									label="Aanpasbaar"
								/>
								<div className="u-text-light">
									Bepaal of deze content component aangepast mag worden door de
									redacteur.
								</div>
							</div>
						</div>
					</>
				);
			}}
		</Formik>
	);
};

export default FormCCSettings;
