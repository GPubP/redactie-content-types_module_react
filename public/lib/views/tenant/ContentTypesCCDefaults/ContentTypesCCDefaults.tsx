import { Checkbox } from '@acpaas-ui/react-components';
import { ContentTypeFieldSchema, FormSchema } from '@redactie/form-renderer-module';
import { FormikOnChangeHandler } from '@redactie/utils';
import { Field, Formik, FormikValues } from 'formik';
import React, { FC, ReactElement, useMemo } from 'react';

import formRendererConnector from '../../../connectors/formRenderer';
import { ContentTypesCCRouteProps } from '../../../contentTypes.types';
import { getDefaultValueSchemas } from '../../../helpers';

import { ALLOWED_FORM_HEADERS } from './ContentTypesCCDefaults.const';

const ContentTypesCCDefaults: FC<ContentTypesCCRouteProps> = ({
	CTField,
	formikRef,
	onSubmit,
	fieldType,
}) => {
	const initialEditableFormValues = {
		editable: !CTField.generalConfig.disabled,
	};
	const editableFieldDisabled = CTField.generalConfig.hidden;

	/**
	 * Hooks
	 */
	const parsedFormSchema: FormSchema = useMemo(
		() => ({
			fields: formRendererConnector.api.parseFields(
				[
					{
						...CTField,
						generalConfig: {
							...CTField.generalConfig,
							hidden: false,
							disabled: false,
							required: false,
							min: 0,
						},
						name: 'defaultValue',
					} as ContentTypeFieldSchema,
				],
				{ noHiddenFields: true, noDisabledFields: true }
			),
		}),
		[CTField]
	);

	const initialDefaultValueFormValue = useMemo(
		() => ({
			defaultValue: CTField.defaultValue,
		}),
		[CTField]
	);

	const { validationSchema, errorMessages } = useMemo(
		() => getDefaultValueSchemas(CTField, fieldType),
		[CTField, fieldType]
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

	const onDefaultValueFormSubmit = (values: FormikValues): void => {
		onSubmit({
			...CTField,
			...values,
			defaultValue: values.defaultValue,
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

		return (
			<formRendererConnector.api.Form
				formikRef={formikRef}
				schema={parsedFormSchema}
				initialValues={initialDefaultValueFormValue}
				validationSchema={validationSchema}
				errorMessages={errorMessages}
				onChange={onDefaultValueFormSubmit}
				allowedHeaders={ALLOWED_FORM_HEADERS}
				noSync
			/>
		);
	};

	return (
		<>
			<h2 className="h3 u-margin-bottom">Standaard waarde</h2>
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
									<small className="u-block u-text-light">
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
