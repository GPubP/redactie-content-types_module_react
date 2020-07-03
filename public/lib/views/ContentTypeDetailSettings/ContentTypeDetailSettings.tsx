import { Button, TextField } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	Container,
} from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { Field, Formik } from 'formik';
import kebabCase from 'lodash.kebabcase';
import React, { FC } from 'react';

import { useCoreTranslation } from '../../connectors/translations';
import { CONTENT_TYPE_DETAIL_TAB_MAP } from '../../contentTypes.const';
import { ContentTypesDetailRouteProps } from '../../contentTypes.types';
import { ContentTypeDetailModel } from '../../store/contentTypes';

import { CT_SETTINGS_VALIDATION_SCHEMA } from './ContentTypeDetailSettings.const';

const ContentTypeSettings: FC<ContentTypesDetailRouteProps> = ({
	onCancel,
	onSubmit,
	contentType,
}) => {
	/**
	 * Hooks
	 */
	const [t] = useCoreTranslation();

	/**
	 * Methods
	 */
	const onFormSubmit = (value: ContentTypeDetailModel): void => {
		onSubmit({ ...contentType?.meta, ...value.meta }, CONTENT_TYPE_DETAIL_TAB_MAP.settings);
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
				<Container>
					<div className="row">
						<div className="col-xs-12 col-md-8 row middle-xs">
							<div className="col-xs-12 col-md-8">
								<Field
									as={TextField}
									id="meta.label"
									label="Naam"
									name="meta.label"
									required
								/>
								<div className="u-text-light u-margin-top-xs">
									Geef het content type een korte en duidelijke naam.
								</div>
							</div>

							<div className="col-xs-12 col-md-4 u-margin-top u-margin-bottom">
								<div>
									{t(CORE_TRANSLATIONS['GENERAL_SYSTEM-NAME'])}:{' '}
									<b>{kebabCase(values.meta.label)}</b>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12 row middle-xs u-margin-top">
							<div className="col-xs-12">
								<Field
									as={TextField}
									id="meta.description"
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
					<ActionBar className="o-action-bar--fixed" isOpen>
						<ActionBarContentSection>
							<div className="u-wrapper row end-xs">
								<Button onClick={onCancel} negative>
									{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
								</Button>
								<Button
									className="u-margin-left-xs"
									onClick={submitForm}
									type="success"
								>
									{t(CORE_TRANSLATIONS['BUTTON_SAVE-NEXT'])}
								</Button>
							</div>
						</ActionBarContentSection>
					</ActionBar>
				</Container>
			)}
		</Formik>
	);
};

export default ContentTypeSettings;
