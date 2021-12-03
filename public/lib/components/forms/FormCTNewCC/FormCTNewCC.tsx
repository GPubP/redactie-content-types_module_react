import { Button, Select, TextField } from '@acpaas-ui/react-components';
import { ErrorMessage } from '@redactie/utils';
import classNames from 'classnames';
import { Field, Formik } from 'formik';
import React, { FC } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';

import { COMPARTMENT_DEFAULT_OPTION, FIELD_TYPES_DEFAULT_OPTION } from './FormCTNewCC.const';
import { FormCTNewCCProps } from './FormCTNewCC.types';

const FormGeneralCC: FC<FormCTNewCCProps> = ({
	fieldTypeOptions,
	compartmentOptions,
	formState,
	onSubmit,
	hasName = true,
	className,
	validationSchema,
	...props
}) => {
	const [t] = useCoreTranslation();

	return (
		<Formik initialValues={formState} validationSchema={validationSchema} onSubmit={onSubmit}>
			{({ submitForm }) => (
				<div className={`row ${className || ''}`} {...props}>
					<div
						className={classNames('col-xs-12 u-margin-bottom-xs', {
							'col-md': hasName,
							'col-sm': !hasName,
						})}
					>
						<Field
							required
							id="fieldType"
							label="Selecteer"
							name="fieldType"
							options={[FIELD_TYPES_DEFAULT_OPTION, ...fieldTypeOptions]}
							as={Select}
						/>
						<small className="u-block u-text-light u-margin-top-xs">
							Selecteer een content component van een bepaald type.
						</small>
						<ErrorMessage name="fieldType" />
					</div>

					{hasName ? (
						<div className="col-xs-12 col-md u-margin-bottom-xs">
							<Field
								required
								as={TextField}
								description="Kies een gebruiksvriendelijk label, bijvoorbeeld 'Titel'."
								id="name"
								label="Naam"
								name="name"
								placeholder="Typ een naam"
								type="text"
							/>
							<ErrorMessage name="name" />
						</div>
					) : null}

					{compartmentOptions && compartmentOptions.length > 1 ? (
						<div className="col-xs-12 col-md u-margin-bottom-xs">
							<Field
								required
								id="compartment"
								label="Compartiment"
								name="compartment"
								options={[COMPARTMENT_DEFAULT_OPTION, ...compartmentOptions]}
								as={Select}
							/>
							<small className="u-block u-text-light u-margin-top-xs">
								Selecteer waar deze content component moet komen.
							</small>
						</div>
					) : null}

					<div
						className={classNames('u-flex-shrink-md', {
							'col-xs-12 col-sm-4 u-margin-top': true,
							'end-xs': !hasName,
						})}
					>
						<Button htmlType="button" onClick={submitForm} outline>
							{t(CORE_TRANSLATIONS.BUTTON_ADD)}
						</Button>
					</div>
				</div>
			)}
		</Formik>
	);
};

export default FormGeneralCC;
