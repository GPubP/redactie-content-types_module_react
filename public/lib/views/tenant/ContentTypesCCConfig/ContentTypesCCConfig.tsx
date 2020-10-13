import { FieldSchema, FormSchema, FormValues } from '@redactie/form-renderer-module';
import { clone } from 'ramda';
import React, { FC, ReactElement, useMemo } from 'react';

import formRendererConnector from '../../../connectors/formRenderer';
import { DEFAULT_VALIDATION_SCHEMA } from '../../../contentTypes.const';
import { ContentTypesCCRouteProps } from '../../../contentTypes.types';
import { generateFRFieldFromCTField, parseFields } from '../../../helpers';
import { Field, Validation } from '../../../services/contentTypes';
import { ValicationCheckWithAllowedFields } from '../../../services/contentTypes/contentTypes.service.types';
import { FieldTypeData } from '../../../services/fieldTypes';
import { ContentTypeFieldDetailModel } from '../../../store/contentTypes';
import { PresetDetailModel } from '../../../store/presets';

const ContentTypesCCConfig: FC<ContentTypesCCRouteProps> = ({
	CTField,
	fieldTypeData,
	formikRef,
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

	/**
	 * Methods
	 */

	const generateFieldConfig = (
		data: FormValues,
		CTField: ContentTypeFieldDetailModel,
		preset?: PresetDetailModel
	): { config: Record<string, any>; validationChecks: Validation['checks'] } => {
		const newConfig = clone(data);

		if (preset && (CTField.config?.fields || []).length > 0) {
			newConfig['fields'] = CTField.config.fields?.map(field => {
				const fieldConfig = newConfig[field.name];

				if (fieldConfig) {
					return {
						...field,
						config: fieldConfig,
					};
				}
				return field;
			});
		}

		return CTField.fieldType.data.formSchema.fields.reduce(
			(acc, field) => {
				const config = field.generalConfig.combinedOutput
					? data[field.name]?.config
					: data[field.name];
				const validation = field.generalConfig.combinedOutput
					? data[field.name]?.validation
					: null;

				if (field.name === 'fields') {
					acc.config[field.name] = config || [];
				} else {
					acc.config[field.name] = config;
				}

				if (validation) {
					const validationCheckIndex = (
						(CTField.validation?.checks as ValicationCheckWithAllowedFields[]) || []
					).findIndex(check => check.id === field.uuid);
					const newCheck = { id: field.uuid, ...validation };

					if (validationCheckIndex === -1) {
						acc.validationChecks = [...(CTField.validation?.checks || []), newCheck];
					} else {
						/**
						 * CTField.validation.checks is weirdly frozen somehow.
						 * This should fix it until we find what freezes it.
						 */
						acc.validationChecks = [...(CTField.validation?.checks || [])];
						acc.validationChecks[validationCheckIndex] = newCheck;
					}
				}

				return acc;
			},
			{
				config: newConfig,
				validationChecks: [] as Validation['checks'],
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
			...(Array.isArray(config.validationChecks) && config.validationChecks.length > 0
				? { validation: { checks: config.validationChecks } }
				: {}),
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
				formikRef={formikRef}
				initialValues={initialFormValue}
				schema={schema}
				validationSchema={DEFAULT_VALIDATION_SCHEMA}
				errorMessages={{}}
				onChange={onFormSubmit}
			/>
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
