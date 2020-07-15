import { Checkbox } from '@acpaas-ui/react-components';
import { FieldDataType, FormSchema } from '@redactie/form-renderer-module';
import { Field, Formik } from 'formik';
import React, { FC, ReactElement } from 'react';

import { AutoSubmit } from '../../components';
import formRendererConnector from '../../connectors/formRenderer';
import { DEFAULT_VALIDATION_SCHEMA } from '../../contentTypes.const';
import { ContentTypesCCRouteProps } from '../../contentTypes.types';
import { generateCCFormState } from '../../helpers';

const ContentTypesCCDefaults: FC<ContentTypesCCRouteProps> = ({
	CTField,
	onSubmit,
	fieldTypeData,
}) => {
	/**
	 * Methods
	 */
	const parsedFormSchema: FormSchema = {
		fields: CTField.fieldType._id
			? [
					{
						name: 'defaultValue',
						module: fieldTypeData.module,
						label: CTField.label,
						type: fieldTypeData.componentName,
						// TODO: should be fixed in form renderer
						// Pass empty options for fields that need it
						config: fieldTypeData.defaultConfig || { options: [] },
						dataType: CTField.dataType.data.type as FieldDataType,
					},
			  ]
			: [],
	};

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
				initialValues={initialValues}
				schema={parsedFormSchema}
				validationSchema={DEFAULT_VALIDATION_SCHEMA}
				errorMessages={{}}
				onSubmit={onSubmit}
			>
				{({ initialValues, submitForm, values }) => (
					<AutoSubmit
						initialValues={initialValues}
						submitForm={submitForm}
						values={values}
					/>
				)}
			</formRendererConnector.api.Form>
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
