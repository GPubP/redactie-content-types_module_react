import { FieldSchema, FormSchema, FormValues } from '@redactie/form-renderer-module';
import { clone } from 'ramda';
import React, { FC, ReactElement, useMemo } from 'react';

import { AutoSubmit } from '../../components';
import formRendererConnector from '../../connectors/formRenderer';
import { DEFAULT_VALIDATION_SCHEMA } from '../../contentTypes.const';
import { ContentTypesCCRouteProps } from '../../contentTypes.types';
import { generateFRFieldFromCTField, parseFields } from '../../helpers';
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
		const config = clone(CTField.config) ?? {};

		if (preset && Array.isArray(config.fields)) {
			return config.fields.reduce((initialValues: FormValues, field: Field) => {
				initialValues[field.name] = field.config;
				const presetField = preset.data.fields.find(f => f.field.name === field.name);

				if (Array.isArray(presetField?.formSchema?.fields)) {
					presetField?.formSchema?.fields.forEach(f => {
						if (field.config[f.name]) {
							initialValues[presetField.field.name][f.name] = field.config[f.name];
							return initialValues;
						}
					});
				}

				return initialValues;
			}, {});
		}

		return config;
	}, [CTField, preset]);

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
		fields: parseFields(fieldTypeData?.formSchema?.fields),
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

	const onFormSubmit = (data: FormValues): void => {
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
