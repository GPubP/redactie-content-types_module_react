import { Button, Modal, TextField } from '@acpaas-ui/react-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { Field, Formik } from 'formik';
import React, { FC } from 'react';

import { useCoreTranslation } from '../../../connectors/translations';

import { FormCTEditCompartmentProps } from './FormCTEditCompartment.types';

const FormCTEditCompartment: FC<FormCTEditCompartmentProps> = ({
	formState,
	className,
	isRemovable = true,
	onSubmit,
	onCancel,
	onDelete,
}) => {
	const [t] = useCoreTranslation();

	return (
		<Formik initialValues={formState} onSubmit={onSubmit}>
			{({ submitForm }) => (
				<div className={className}>
					<div className="row">
						<div className="col-xs-12 col-md-6">
							<Field
								as={TextField}
								description="Kies een gebruiksvriendelijke naam voor het compartiment."
								id="edit-compartment-name"
								label="Naam"
								name="name"
								type="small"
								placeholder="Typ een naam"
							/>
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
								<div style={{ display: 'inline-block' }}>
									<Modal
										appElement="#root"
										title="Ben je zeker dat je het compartiment wil verwijderen?"
										confirmText={t(CORE_TRANSLATIONS.BUTTON_REMOVE)}
										denyText={t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
										shouldCloseOnEsc={true}
										shouldCloseOnOverlayClick={true}
										onConfirm={onDelete}
										triggerElm={
											<Button
												icon="trash"
												size="small"
												onClick={onDelete}
												type="danger"
												transparent
											/>
										}
									></Modal>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</Formik>
	);
};

export default FormCTEditCompartment;
