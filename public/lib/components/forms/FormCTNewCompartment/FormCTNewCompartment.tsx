import { Button, TextField } from '@acpaas-ui/react-components';
import { ErrorMessage } from '@redactie/utils';
import classNames from 'classnames';
import { Field, Formik } from 'formik';
import React, { FC } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';

import { NEW_COMPARTMENT_FORM_VALIDATION_SCHEMA } from './FormCTNewCompartment.const';
import { FormCTNewCompartmentProps } from './FormCTNewCompartment.types';

const FormCTNewCompartment: FC<FormCTNewCompartmentProps> = ({
	onSubmit,
	formState,
	compartments,
	className,
}) => {
	const [t] = useCoreTranslation();

	return (
		<Formik
			initialValues={formState}
			validationSchema={NEW_COMPARTMENT_FORM_VALIDATION_SCHEMA(compartments)}
			onSubmit={onSubmit}
		>
			{({ submitForm }) => (
				<div className={classNames(className, 'row')}>
					<div className="col-xs-12 col-md">
						<Field
							required
							as={TextField}
							description="Kies een gebruiksvriendelijke naam voor het compartiment."
							id="compartment-name"
							label="Naam"
							name="name"
							placeholder="Typ een naam"
							type="text"
						/>
						<ErrorMessage name="name" />
					</div>
					<div className="u-flex-shrink-md col-xs-12 col-sm-4 u-margin-top">
						<Button htmlType="button" onClick={submitForm} outline>
							{t(CORE_TRANSLATIONS.BUTTON_ADD)}
						</Button>
					</div>
				</div>
			)}
		</Formik>
	);
};

export default FormCTNewCompartment;
