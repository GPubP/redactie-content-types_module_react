import { FieldSchema, FormSchema, FormValues } from '@redactie/form-renderer-module';
import React, { FC, ReactElement, useMemo } from 'react';

import { AutoSubmit } from '../../components';
import formRendererConnector from '../../connectors/formRenderer';
import { DEFAULT_VALIDATION_SCHEMA } from '../../contentTypes.const';
import { ContentTypesCCRouteProps } from '../../contentTypes.types';
import { generateFRFieldFromCTField } from '../../helpers';
import { Field } from '../../services/contentTypes';
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
	const initialFormValue: FormValues = useMemo(() => {
		const { config } = CTField;

		if ((config.fields || []).length > 0) {
			return (
				config.fields?.reduce((initialValues: FormValues, field: Field) => {
					initialValues[field.name] = field.config;
					return initialValues;
				}, {} as FormValues) || {}
			);
		}

		return CTField.config;
	}, [CTField]);

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

	const generateFieldConfig = (
		data: FormValues,
		CTField: ContentTypeFieldDetailModel,
		preset?: PresetDetailModel
	): Record<string, any> => {
		if (preset && (CTField.config?.fields || []).length > 0) {
			return {
				fields: CTField.config.fields?.map(field => {
					const fieldConfig = data[field.name];

					if (fieldConfig) {
						return {
							...field,
							config: fieldConfig,
						};
					}
					return field;
				}),
			};
		}

		return data;
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
		onSubmit({ config: generateFieldConfig(data, CTField, preset) });
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
				schema={
					preset
						? generateFormSchemaFromPreset(preset)
						: generateFormSchemaFromFieldTypeData(fieldTypeData)
				}
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
