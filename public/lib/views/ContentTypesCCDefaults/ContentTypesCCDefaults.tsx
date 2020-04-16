import { Checkbox, TextField } from '@acpaas-ui/react-components';
import { Field, Formik } from 'formik';
import React, { FC } from 'react';

import { AutoSubmit } from '../../components';
import { generateCCFormState } from '../../contentTypes.helpers';
import { ContentTypesCCRouteProps } from '../../contentTypes.types';

const ContentTypesCCDefaults: FC<ContentTypesCCRouteProps> = ({ CTField, onSubmit }) => {
	return (
		<>
			<h6 className="u-margin-bottom">Standaard waarde</h6>
			<p className="u-margin-bottom">
				De standaard waarde is de content die vooringevuld zal zijn voor deze content
				component bij het aanmaken van een content item.
			</p>
			<Formik initialValues={generateCCFormState(CTField)} onSubmit={onSubmit}>
				{({ values }) => {
					return (
						<>
							<AutoSubmit />
							<div className="row">
								<div className="col-xs-12">
									<Field
										as={TextField}
										id="defaultValue"
										name="defaultValue"
										label={CTField.label}
									/>
									<div className="u-text-light u-margin-top-xs">
										Vul het veld in.
									</div>
								</div>
							</div>
							<div className="row u-margin-top">
								<div className="col-xs-12">
									<Field
										as={Checkbox}
										checked={values.generalConfig.required}
										id="generalConfig.required"
										name="generalConfig.required"
										label="Aanpasbaar"
									/>
									<div className="u-text-light">
										Bepaal of deze content component aangepast mag worden door
										de redacteur.
									</div>
								</div>
							</div>
						</>
					);
				}}
			</Formik>
		</>
	);
};

export default ContentTypesCCDefaults;
