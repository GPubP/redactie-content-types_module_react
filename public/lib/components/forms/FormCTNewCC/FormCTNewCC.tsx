import { Button, Select, TextField } from '@acpaas-ui/react-components';
import { Field, Formik } from 'formik';
import React, { FC } from 'react';

import { FIELD_TYPES_DEFAULT_OPTION } from './FormCTNewCC.const';
import { FormCTNewCCProps } from './FormCTNewCC.types';

const FormGeneralCC: FC<FormCTNewCCProps> = ({ fieldTypeOptions, formState, onSubmit }) => {
	return (
		<Formik initialValues={formState} onSubmit={onSubmit}>
			{({ submitForm }) => (
				<>
					<div className="row u-margin-top u-margin-bottom">
						<div className="col-xs-6">
							<Field
								id="fieldType"
								label="Selecteer"
								name="fieldType"
								options={[FIELD_TYPES_DEFAULT_OPTION, ...fieldTypeOptions]}
								as={Select}
							/>
							<div className="u-text-light u-margin-top-xs">
								Selecteer een content component van een bepaald type.
							</div>
						</div>

						<div className="col-xs-6">
							<Field
								type="text"
								id="name"
								label="Naam"
								name="name"
								placeholder="Typ een naam"
								as={TextField}
							/>
							<div className="u-text-light u-margin-top-xs">
								Kies een gebruiksvriendelijke redactie naam, bijvoorbeeld
								&apos;Titel&apos;.
							</div>
						</div>
					</div>

					<Button onClick={submitForm} outline>
						Toevoegen
					</Button>
				</>
			)}
		</Formik>
	);
};

export default FormGeneralCC;
