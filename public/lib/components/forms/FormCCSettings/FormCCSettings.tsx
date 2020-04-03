import { Checkbox, RadioGroup, TextArea, TextField } from '@acpaas-ui/react-components';
import { Field, Formik } from 'formik';
import kebabCase from 'lodash.kebabcase';
import React, { FC } from 'react';

import { FormCCSettingsProps } from './FormCCSettings.types';

const radioGroup = [
	{ key: 'single', label: 'Eén item', value: false },
	{ key: 'multiple', label: 'Meerdere items', value: true },
];

const FormCCSettings: FC<FormCCSettingsProps> = ({ initialValues, onSubmit }) => {
	return (
		<Formik initialValues={initialValues} onSubmit={onSubmit}>
			<div className="row">
				<div className="col-xs-12 col-md-8 row middle-xs">
					<div className="col-xs-12 col-md-8">
						<Field as={TextField} label="Label" placeholder="Typ een label" />
						<div className="u-text-light u-margin-top-xs">
							Geef deze content component een gebruiksvriendelijke naam, bijvoorbeeld
							&apos;Titel&apos;.
						</div>
					</div>

					<div className="col-xs-12 col-md-4 u-margin-top u-margin-bottom">
						<div>
							Systeemnaam: <b>{kebabCase()}</b>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-xs-12 col-md-8">
					<Field as={TextArea} label="Richtlijn (optioneel)" />
					<div className="u-text-light u-margin-top-xs">
						Geef de redacteur een richtlijn voor het ingeven van deze content component.
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-xs-12 col-md-8">
					<Field as={RadioGroup} label="Richtlijn (optioneel)" options={radioGroup} />
					<div className="u-text-light u-margin-top-xs">
						Geef de redacteur een richtlijn voor het ingeven van deze content component.
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-xs-12 col-md-8">
					<Field as={Checkbox} label="Verborgen" />
					<div className="u-text-light u-margin-top-xs">
						Bepaal of deze content component zichtbaar mag zijn. Opgelet, content
						componenten die een standaard waarde krijgen en als &apos;niet
						aanpasbaar&apos; worden ingesteld worden onzichtbaar voor de redacteur.
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-xs-12 col-md-8">
					<Field as={Checkbox} label="Aanpasbaar" />
					<div className="u-text-light u-margin-top-xs">
						Bepaal of deze content component aangepast mag worden door de redacteur.
					</div>
				</div>
			</div>
		</Formik>
	);
};

export default FormCCSettings;
