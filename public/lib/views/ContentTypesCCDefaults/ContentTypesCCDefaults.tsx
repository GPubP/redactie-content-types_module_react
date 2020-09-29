import { Checkbox } from '@acpaas-ui/react-components';
import { FormSchema } from '@redactie/form-renderer-module';
import { FormikOnChangeHandler } from '@redactie/utils';
import { Field, Formik, FormikValues } from 'formik';
import React, { FC, ReactElement, useMemo } from 'react';

import formRendererConnector from '../../connectors/formRenderer';
import { DEFAULT_VALIDATION_SCHEMA } from '../../contentTypes.const';
import { ContentTypesCCRouteProps } from '../../contentTypes.types';
import { parseFields } from '../../helpers';

const ContentTypesCCDefaults: FC<ContentTypesCCRouteProps> = ({ CTField, formikRef, onSubmit }) => {
	const initialEditableFormValues = {
		editable: !CTField.generalConfig.disabled,
	};
	const editableFieldDisabled = CTField.generalConfig.hidden;

	/**
	 * Hooks
	 */
	const parsedFormSchema: FormSchema = useMemo(
		() => ({
			fields: parseFields([
				{
					...CTField,
					generalConfig: {
						...CTField.generalConfig,
						hidden: false,
						disabled: false,
						required: false,
					},
					name: 'defaultValue',
				},
			]),
		}),
		[CTField]
	);

	/**
	 * Methods
	 */
	const onEditableFormFormSubmit = (values: FormikValues): void => {
		onSubmit({
			generalConfig: {
				disabled: !values.editable,
			},
		});
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
				formikRef={formikRef}
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
			<Formik initialValues={initialEditableFormValues} onSubmit={onEditableFormFormSubmit}>
				{({ submitForm, values }) => {
					return (
						<div className="u-margin-top">
							<FormikOnChangeHandler onChange={submitForm} />
							<div className="row">
								<div className="col-xs-12">
									<Field
										as={Checkbox}
										checked={values.editable}
										id="editable"
										disabled={editableFieldDisabled}
										name="editable"
										label="Aanpasbaar"
									/>
									<small className="u-text-light">
										Bepaal of deze content component aangepast mag worden door
										de redacteur.
									</small>
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
