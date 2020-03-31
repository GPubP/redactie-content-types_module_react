import { Button, TextField } from '@acpaas-ui/react-components';
import { Field, Formik } from 'formik';
import kebabCase from 'lodash.kebabcase';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import { CT_CC_VALIDATION_SCHEMA } from './ContentTypeSettings.conts';
import { ContenTypeCCProps } from './ContentTypeSettings.types';

const ContentTypeSettings: FC<ContenTypeCCProps> = ({ basePath, contentType, onSubmit }) => {
	/**
	 * Hooks
	 */
	const history = useHistory();

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		history.push(basePath);
	};

	return (
		<Formik
			initialValues={contentType}
			onSubmit={onSubmit}
			validationSchema={CT_CC_VALIDATION_SCHEMA}
		>
			{({ submitForm, values }) => (
				<>
					<div className="row">
						<div className="col-xs-12 col-md-8 row middle-xs">
							<div className="col-xs-12 col-md-8">
								<Field as={TextField} label="Naam" name="meta.label" required />
								<div className="u-text-light u-margin-top-xs">
									Geef het content type een korte en duidelijke naam.
								</div>
							</div>

							<div className="col-xs-12 col-md-4">
								<div className="u-margin-top">
									Systeemnaam: <b>{kebabCase(values.meta.label)}</b>
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
									name="meta.description"
									required
								/>
								<div className="u-text-light u-margin-top-xs">
									Geef het content type een duidelijke beschrijving voor in het
									overzicht.
								</div>
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
