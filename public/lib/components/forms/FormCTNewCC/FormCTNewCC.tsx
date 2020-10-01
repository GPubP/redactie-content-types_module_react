import { Button, Select, TextField } from '@acpaas-ui/react-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import classNames from 'classnames';
import { Field, Formik } from 'formik';
import React, { FC } from 'react';

import { useCoreTranslation } from '../../../connectors/translations';

import { FIELD_TYPES_DEFAULT_OPTION } from './FormCTNewCC.const';
import { FormCTNewCCProps } from './FormCTNewCC.types';

const FormGeneralCC: FC<FormCTNewCCProps> = ({
	fieldTypeOptions,
	formState,
	onSubmit,
	hasName = true,
	className,
	...props
}) => {
	const [t] = useCoreTranslation();

	return (
		<Formik initialValues={formState} onSubmit={onSubmit}>
			{({ submitForm }) => (
				<div className={`row ${className || ''}`} {...props}>
					<div
						className={classNames({
							'col-xs-12': true,
							'col-md': hasName,
							'col-sm': !hasName,
						})}
					>
						<Field
							id="fieldType"
							label="Selecteer"
							name="fieldType"
							options={[FIELD_TYPES_DEFAULT_OPTION, ...fieldTypeOptions]}
							as={Select}
						/>
						<small className="u-block u-text-light u-margin-top-xs">
							Selecteer een content component van een bepaald type.
						</small>
					</div>

					{hasName ? (
						<div className="col-xs-12 col-md">
							<Field
								as={TextField}
								description="Kies een gebruiksvriendelijke redactie naam, bijvoorbeeld 'Titel'."
								id="name"
								label="Naam"
								name="name"
								placeholder="Typ een naam"
								type="text"
							/>
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
