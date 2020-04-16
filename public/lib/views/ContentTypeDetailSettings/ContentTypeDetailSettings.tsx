import { Button, TextField } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import { Field, Formik } from 'formik';
import kebabCase from 'lodash.kebabcase';
import React, { FC } from 'react';

import { CONTENT_TYPE_DETAIL_TAB_MAP } from '../../contentTypes.const';
import { ContentTypesDetailRouteProps } from '../../contentTypes.types';
import { ContentTypeSchema } from '../../services/contentTypes';

import { CT_SETTINGS_VALIDATION_SCHEMA } from './ContentTypeDetailSettings.const';

const ContentTypeSettings: FC<ContentTypesDetailRouteProps> = ({
	contentType,
	onCancel,
	onSubmit,
}) => {
	/**
	 * Methods
	 */
	const onFormSubmit = (value: ContentTypeSchema): void => {
		onSubmit({ ...contentType.meta, ...value.meta }, CONTENT_TYPE_DETAIL_TAB_MAP.settings);
	};

	/**
	 * Render
	 */
	return (
		<Formik
			initialValues={contentType}
			onSubmit={onFormSubmit}
			validationSchema={CT_SETTINGS_VALIDATION_SCHEMA}
		>
			{({ submitForm, values }) => (
				<>
					<div className="u-container u-wrapper u-margin-bottom-lg">
						<div className="row">
							<div className="col-xs-12 col-md-8 row middle-xs">
								<div className="col-xs-12 col-md-8">
									<Field as={TextField} label="Naam" name="meta.label" required />
									<div className="u-text-light u-margin-top-xs">
										Geef het content type een korte en duidelijke naam.
									</div>
								</div>

								<div className="col-xs-12 col-md-4 u-margin-top u-margin-bottom">
									<div>
										Systeemnaam: <b>{kebabCase(values.meta.label)}</b>
									</div>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-xs-12 row middle-xs u-margin-top">
								<div className="col-xs-12">
									<Field
										as={TextField}
										label="Beschrijving"
										name="meta.description"
										required
									/>
									<div className="u-text-light u-margin-top-xs">
										Geef het content type een duidelijke beschrijving voor in
										het overzicht.
									</div>
								</div>
							</div>
						</div>
					</div>
					<ActionBar className="o-action-bar--fixed" isOpen>
						<ActionBarContentSection>
							<div className="u-wrapper">
								<Button
									className="u-margin-right-xs"
									onClick={submitForm}
									type="success"
								>
									Bewaar en ga verder
								</Button>
								<Button onClick={onCancel} outline>
									Annuleer
								</Button>
							</div>
						</ActionBarContentSection>
					</ActionBar>
				</>
			)}
		</Formik>
	);
};

export default ContentTypeSettings;
