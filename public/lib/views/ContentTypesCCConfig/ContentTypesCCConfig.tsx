import { FieldSchema, FormSchema, FormValues } from '@redactie/form-renderer-module';
import { clone } from 'ramda';
import React, { FC, ReactElement, useCallback, useMemo, useState } from 'react';

import { AutoSubmit } from '../../components';
import formRendererConnector from '../../connectors/formRenderer';
import { DEFAULT_VALIDATION_SCHEMA } from '../../contentTypes.const';
import { ContentTypesCCRouteProps } from '../../contentTypes.types';
import { generateFRFieldFromCTField } from '../../helpers';
import { Field, Validation } from '../../services/contentTypes';
import { FieldTypeData } from '../../services/fieldTypes';
import { ContentTypeFieldDetailModel } from '../../store/contentTypes';
import { PresetDetailModel } from '../../store/presets';

const ContentTypesCCConfig: FC<ContentTypesCCRouteProps> = ({
	CTField,
	fieldTypeData,
	preset,
	onSubmit,
}) => {
	/**
	 * Hooks
	 */
	const [initialFormValuesSet, setInitialFormValuesSet] = useState<boolean>(false);

	const onFormSubmit = useCallback(
		(data: FormValues): void => {
			const generateFieldConfig = (
				data: FormValues,
				CTField: ContentTypeFieldDetailModel,
				preset?: PresetDetailModel
			): Record<string, any> => {
				const config = data?.config && data?.validation ? data.config : data;

				if (!preset || (CTField.config?.fields || []).length <= 0) {
					return config;
				}

				return {
					fields: CTField.config.fields?.map(field => {
						const fieldConfig = config[field.name];

						if (fieldConfig) {
							return {
								...field,
								config: {
									...field.config,
									...fieldConfig,
								},
							};
						}
						return field;
					}),
				};
			};

			onSubmit({
				// eslint-disable-next-line @typescript-eslint/no-use-before-define
				config: generateFieldConfig(data, CTField, preset),
				// TODO: find a way to set validation based on configuration
				// validation: generateFieldValidation(data, CTField),
			});
		},
		[CTField, onSubmit, preset]
	);

	/**
	 * initialFormValue
	 *
	 * This method creates the initialFormValues by using the CTField config object
	 *
	 * PRESET EXAMPLE:
	 * CONVERTS =>
	 * config: {
	 * 		fields: [{
	 * 			name: 'presetField'
	 * 			config: {
	 * 				someConfigField: 'value',
	 * 				someOtherConfigField: 'value'
	 * 			}
	 * 		}]
	 * }
	 * TO =>
	 * initialFormValue: {
	 * 		fields: [{
	 * 			config: {
	 * 				someConfigField: 'value',
	 * 				someOtherConfigField: 'value'
	 * 			}
	 * 		}],
	 * 		// The presetField prop represents the form data that is used
	 * 		presetField: {
	 * 			someConfigField: 'value',
	 * 			someOtherConfigField: 'value'
	 * 		}
	 * }
	 */
	const initialFormValue: FormValues = useMemo(() => {
		// Clone the config because we can not mutate the store
		let config = clone(CTField.config) ?? {};
		const { formSchema } = fieldTypeData;

		if (!preset) {
			config =
				formSchema.fields?.reduce((initialValues: FormValues, field) => {
					// Use default value when the configuration field is not defined on the initialValues object
					// This happens the first time the user enters this page
					if (!initialValues[field.name]) {
						initialValues[field.name] = field.defaultValue ?? '';
					}
					// return initialValues when the field already exist
					return initialValues;
				}, config) || {};
		}

		if (preset && (config.fields || []).length > 0) {
			config =
				config.fields?.reduce((initialValues: FormValues, field: Field) => {
					initialValues[field.name] = field.config;
					const presetField = preset.data.fields.find(f => f.field.name === field.name);

					if (Array.isArray(presetField?.formSchema?.fields)) {
						presetField?.formSchema?.fields.forEach(f => {
							if (field.config[f.name]) {
								initialValues[presetField.field.name][f.name] =
									field.config[f.name];
								return initialValues;
							}
							// Use default value when the field is not defined on the fields config object
							// This happens the first time the users enters this page
							initialValues[presetField.field.name][f.name] = f.defaultValue ?? '';
						});
					}

					return initialValues;
				}, config) || {};
		}

		if (!initialFormValuesSet) {
			setInitialFormValuesSet(true);
			// We need save the default values since the form will not trigger an onchange event
			// when the initial values of the from are changed.
			// If we don't do this the default values will be lost
			onFormSubmit(config);
		}

		return config;
	}, [CTField, fieldTypeData, initialFormValuesSet, preset, onFormSubmit]);

	/**
	 * Methods
	 */
	const generateFormSchemaFromPreset = (preset: PresetDetailModel): FormSchema => ({
		fields: (preset?.data.fields || []).reduce((fSchema, presetField) => {
			presetField.formSchema?.fields?.forEach(field =>
				fSchema.push(
					generateFRFieldFromCTField(field, `${presetField.field.name}.${field.name}`)
				)
			);
			return fSchema;
		}, [] as FieldSchema[]),
	});

	const generateFormSchemaFromFieldTypeData = (fieldTypeData: FieldTypeData): FormSchema => ({
		fields:
			(fieldTypeData?.formSchema.fields || []).map(
				(field): FieldSchema => generateFRFieldFromCTField(field)
			) || [],
	});

	const schema: FormSchema = useMemo(
		() =>
			preset
				? generateFormSchemaFromPreset(preset)
				: generateFormSchemaFromFieldTypeData(fieldTypeData),
		[fieldTypeData, preset]
	);

	const generateFieldValidation = (
		data: FormValues,
		CTField: ContentTypeFieldDetailModel
	): Validation => {
		if (!data.config || !data.validation) {
			return CTField.validation as Validation;
		}

		return {
			...(CTField.validation || {}),
			type: CTField.dataType.data.type,
			checks: [...(CTField.validation as Validation)?.checks, data.validation],
		};
	};

	const hasConfiguration = (
		fieldTypeData: FieldTypeData,
		preset?: PresetDetailModel
	): boolean => {
		if (preset) {
			const { data } = preset;
			return !!data.fields.find(field => !!field.formSchema?.fields?.length);
		}
		return !!fieldTypeData.formSchema?.fields?.length;
	};

	/**
	 * Render
	 */
	const renderCCConfig = (): ReactElement => {
		if (!formRendererConnector.api || !hasConfiguration(fieldTypeData, preset)) {
			return <p>Er zijn geen configuratie mogelijkheden</p>;
		}

		return (
			<formRendererConnector.api.Form
				initialValues={initialFormValue}
				schema={schema}
				validationSchema={DEFAULT_VALIDATION_SCHEMA}
				errorMessages={{}}
				onSubmit={onFormSubmit}
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
			<h6 className="u-margin-bottom">Configuratie</h6>
			{renderCCConfig()}
		</>
	);
};

export default ContentTypesCCConfig;
