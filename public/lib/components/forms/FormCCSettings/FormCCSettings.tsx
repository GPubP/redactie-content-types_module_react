import { Checkbox, RadioGroup, Textarea, TextField } from '@acpaas-ui/react-components';
import { Field, Formik } from 'formik';
import kebabCase from 'lodash.kebabcase';
import React, { ChangeEvent, FC, useState } from 'react';

import { CCSettingsFormState } from '../../../contentTypes.types';
import AutoSubmit from '../AutoSubmit/AutoSubmit';

import { IS_MULTIPLE_OPTIONS } from './FormCCSettings.const';
import { FormCCSettingsProps } from './FormCCSettings.types';

const FormCCSettings: FC<FormCCSettingsProps> = ({ initialValues, onSubmit }) => {
	const [isMultiple, setIsMultiple] = useState(initialValues.generalConfig.max > 1);

	const onFormSubmit = (values: CCSettingsFormState): void => {
		// Reset min and max to initial values if not muliple
		onSubmit({
			...values,
			generalConfig: {
				...values.generalConfig,
				min: isMultiple ? values.generalConfig.min : 0,
				max: isMultiple ? values.generalConfig.max : 1,
			},
		});
	};

	return (
		<Formik initialValues={initialValues} onSubmit={onFormSubmit}>
			{({ values }) => {
				return (
					<>
						<AutoSubmit />
						<div className="row">
							<div className="col-xs-12 row middle-xs">
								<div className="col-xs-12 col-md-8">
									<Field
										as={TextField}
										id="label"
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
									id="config.guideline"
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
								<RadioGroup
									id="isMultiple"
									name="isMultiple"
									onChange={(e: ChangeEvent<HTMLInputElement>) =>
										setIsMultiple(e.target.value === 'true')
									}
									options={IS_MULTIPLE_OPTIONS}
									value={String(isMultiple)}
								/>
								<div className="u-text-light u-margin-top-xs">
									Bepaal hoeveel items van dit component er aangemaakt kunnen
									worden
								</div>
								{isMultiple && (
									<div className="row u-margin-top">
										<div className="col-xs-2">
											<Field
												as={TextField}
												type="number"
												id="generalConfig.min"
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
												name="generalConfig.max"
											/>
										</div>
									</div>
								)}
							</div>
						</div>
						<div className="row u-margin-top">
							<div className="col-xs-12">
								<Field
									as={Checkbox}
									checked={values.generalConfig.hidden}
									id="generalConfig.hidden"
									name="generalConfig.hidden"
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
					</>
				);
			}}
		</Formik>
	);
};

export default FormCCSettings;
