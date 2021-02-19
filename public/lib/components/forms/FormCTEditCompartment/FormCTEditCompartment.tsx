import { Button, TextField } from '@acpaas-ui/react-components';
import { DeletePrompt, ErrorMessage } from '@redactie/utils';
import { Field, Formik } from 'formik';
import React, { FC, useState } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';

import { EDIT_COMPARTMENT_FORM_VALIDATION_SCHEMA } from './FormCTEditCompartment.const';
import { FormCTEditCompartmentProps } from './FormCTEditCompartment.types';

const FormCTEditCompartment: FC<FormCTEditCompartmentProps> = ({
	isLoading,
	formState,
	className,
	isRemovable = true,
	onSubmit,
	onCancel,
	onDelete,
}) => {
	const [t] = useCoreTranslation();
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const onDeletePromptConfirm = (): void => {
		if (onDelete) {
			onDelete();
		};
	};

	const onDeletePromptCancel = (): void => {
		setShowDeleteModal(false);
	};

	return (
		<Formik
			initialValues={formState}
			validationSchema={EDIT_COMPARTMENT_FORM_VALIDATION_SCHEMA}
			onSubmit={onSubmit}
		>
			{({ submitForm }) => (
				<div className={className}>
					<div className="row">
						<div className="col-xs-12 col-md-6">
							<Field
								required
								as={TextField}
								description="Kies een gebruiksvriendelijke naam voor het compartiment."
								id="edit-compartment-name"
								label="Naam"
								name="name"
								type="small"
								placeholder="Typ een naam"
							/>
							<ErrorMessage name="name" />
						</div>
					</div>
					<div className="row u-margin-top">
						<div className="col-xs-12">
							<Button
								className="u-margin-right-xs"
								type="primary"
								size="small"
								onClick={submitForm}
							>
								Wijzig
							</Button>
							<Button
								className="u-margin-right-xs"
								size="small"
								onClick={onCancel}
								outline
							>
								{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
							</Button>
							{onDelete && isRemovable && (
								<>
									<Button
										icon="trash"
										size="small"
										onClick={() => setShowDeleteModal(true)}
										type="danger"
										transparent
									/>
									<DeletePrompt
										isDeleting={isLoading}
										body="Ben je zeker dat je dit compartement wil verwijderen?"
										show={showDeleteModal}
										onCancel={onDeletePromptCancel}
										onConfirm={onDeletePromptConfirm}
									/>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</Formik>
	);
};

export default FormCTEditCompartment;
