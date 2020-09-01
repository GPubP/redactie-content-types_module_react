import { FieldSchema, FormSchema, FormValues } from '@redactie/form-renderer-module';
import { clone } from 'ramda';
import React, { FC, ReactElement, useMemo } from 'react';

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
	const initialFormValue: FormValues = useMemo(() => {
		const { config } = CTField;

		if (preset && (config.fields || []).length > 0) {
			return (
				config.fields?.reduce((initialValues: FormValues, field: Field) => {
					initialValues[field.name] = field.config;
					return initialValues;
				}, {} as FormValues) || {}
			);
		}

		return CTField.config;
	}, [CTField, preset]);

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

	/**
	 * Methods
	 */

	const generateFieldConfig = (
		data: FormValues,
		CTField: ContentTypeFieldDetailModel,
		preset?: PresetDetailModel
	): { config: Record<string, any>; validation: Record<string, Validation> } => {
		return CTField.fieldType.data.formSchema.fields.reduce(
			(acc, field) => {
				const config = field.generalConfig.combinedOutput
					? data[field.name]?.config
					: data[field.name];
				const validation = field.generalConfig.combinedOutput
					? data[field.name]?.validation
					: null;

				if (
					field.name === 'fields' &&
					preset &&
					(CTField.config?.fields || []).length > 0
				) {
					acc.config['fields'] = CTField.config.fields?.map(field => {
						const fieldConfig = config[field.name];

						if (fieldConfig) {
							return {
								...field,
								config: fieldConfig,
							};
						}
						return field;
					});
				} else if (field.name === 'fields') {
					acc.config[field.name] = config || [];
				} else {
					acc.config[field.name] = config;
				}

				if (validation) {
					acc.validation = validation;
				}

				return acc;
			},
			{
				config: clone(data),
				validation: {} as Record<string, Validation>,
			}
		);
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
		const config = generateFieldConfig(data, CTField, preset);

		onSubmit({
			config: config.config,
			...(Object.values(config.validation).length ? { validation: config.validation } : {}),
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
