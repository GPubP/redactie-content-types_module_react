import { Button, TextField } from '@acpaas-ui/react-components';
import { Field, Formik } from 'formik';
import kebabCase from 'lodash.kebabcase';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import { generateSettingsFormState } from '../../content-types.helpers';
import { createSettings } from '../../content-types.service';
import { ContentTypeSettingsFormState, ContentTypesRouteProps } from '../../content-types.types';

import { CONTENT_TYPES_SETTINGS_VALIDATION_SCHEMA } from './ContentTypeSettings.conts';

const ContentTypeSettings: FC<ContentTypesRouteProps> = ({ basePath }) => {
	/**
	 * Hooks
	 */
	const history = useHistory();

	/**
	 * Methods
	 */
	const navigateToNext = (): void => {
		history.push('componenten');
	};

	const navigateToOverview = (): void => {
		history.push(basePath);
	};

	const onSubmit = ({ name, description }: ContentTypeSettingsFormState): void => {
		const request = { name, description };
		const response = createSettings(request);

		if (response) {
			// Create was succesful, go to next tab
			navigateToNext();
		}
	};

	return (
		<Formik
			initialValues={generateSettingsFormState()}
			onSubmit={onSubmit}
			validationSchema={CONTENT_TYPES_SETTINGS_VALIDATION_SCHEMA}
		>
			{({ submitForm, values }) => (
				<>
					<div className="row">
						<div className="col-xs-12 col-md-8 row middle-xs">
							<div className="col-xs-12 col-md-8">
								<Field as={TextField} label="Naam" name="name" required />
							</div>

							<div className="col-xs-12 col-md-4">
								<div className="u-margin-top">
									Systeemnaam: <b>{kebabCase(values.name)}</b>
								</div>
							</div>
						</div>
					</div>
					<div className="row u-margin-top">
						<div className="col-xs-12 row middle-xs">
							<div className="col-xs-12">
								<Field
									as={TextField}
									label="Beschrijving"
									name="description"
									required
								/>
							</div>
						</div>
					</div>
					{/* TODO: these should go in the action bar */}
					<div className="u-margin-top">
						<Button
							className="u-margin-right-xs"
							onClick={() => submitForm()}
							type="success"
						>
							Bewaar en ga verder
						</Button>
						<Button onClick={navigateToOverview} outline>
							Annuleer
						</Button>
					</div>
				</>
			)}
		</Formik>
	);
};

export default ContentTypeSettings;
