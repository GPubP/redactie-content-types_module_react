import { Button, TextField } from '@acpaas-ui/react-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import classNames from 'classnames';
import { Field, Formik } from 'formik';
import React, { FC } from 'react';

import { useCoreTranslation } from '../../../connectors/translations';

import { FormCTNewCompartmentProps } from './FormCTNewCompartment.types';

const FormCTNewCompartment: FC<FormCTNewCompartmentProps> = ({
	onSubmit,
	formState,
	className,
}) => {
	const [t] = useCoreTranslation();

	return (
		<Formik initialValues={formState} onSubmit={onSubmit}>
			{({ submitForm }) => (
				<div className={classNames(className, 'row')}>
					<div className="col-xs-12 col-md">
						<Field
							as={TextField}
							description="Kies een gebruiksvriendelijke naam voor het compartiment."
							id="compartment-name"
							label="Naam"
							name="name"
							placeholder="Typ een naam"
							type="text"
						/>
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
