import { Checkbox } from '@acpaas-ui/react-components';
import { FormSchema } from '@redactie/form-renderer-module';
import { Field, Formik } from 'formik';
import React, { FC, ReactElement, useMemo } from 'react';

import { AutoSubmit } from '../../components';
import formRendererConnector from '../../connectors/formRenderer';
import { DEFAULT_VALIDATION_SCHEMA } from '../../contentTypes.const';
import { ContentTypesCCRouteProps } from '../../contentTypes.types';
import { generateCCFormState, parseFields } from '../../helpers';

const ContentTypesCCDefaults: FC<ContentTypesCCRouteProps> = ({ CTField, onSubmit }) => {
	/**
	 * Hooks
	 */
	const parsedFormSchema: FormSchema = useMemo(
		() => ({
			fields: parseFields([
				{
					...CTField,
					name: 'defaultValue',
				},
			]),
		}),
		[CTField]
	);

	/**
	 * Render
	 */
	const renderCCDefaults = (): ReactElement | null => {
		if (!formRendererConnector.api || parsedFormSchema.fields.length === 0) {
			return (
				<p className="u-margin-bottom">
					Er zijn geen mogelijkheden voor een standaard waarde in te vullen
				</p>
			);
		}
		const { defaultValue } = CTField;
		const initialValues = defaultValue ? { defaultValue } : {};

		return (
			<formRendererConnector.api.Form
				schema={parsedFormSchema}
				initialValues={initialValues}
				validationSchema={DEFAULT_VALIDATION_SCHEMA}
				errorMessages={{}}
				onChange={onSubmit}
			/>
		);
	};

	return (
		<>
			<h6 className="u-margin-bottom">Standaard waarde</h6>
			<p className="u-margin-bottom">
				De standaard waarde is de content die vooringevuld zal zijn voor deze content
				component bij het aanmaken van een content item.
			</p>
			{renderCCDefaults()}
			<Formik initialValues={generateCCFormState(CTField)} onSubmit={onSubmit}>
				{({ values }) => {
					return (
						<div className="u-margin-top">
							<AutoSubmit />
							<div className="row">
								<div className="col-xs-12">
									<Field
										as={Checkbox}
										checked={values.generalConfig.required}
										id="generalConfig.required"
										name="generalConfig.required"
										label="Aanpasbaar"
									/>
									<div className="u-text-light">
										Bepaal of deze content component aangepast mag worden door
										de redacteur.
									</div>
								</div>
							</div>
						</div>
					);
				}}
			</Formik>
		</>
	);
};

export default ContentTypesCCDefaults;
