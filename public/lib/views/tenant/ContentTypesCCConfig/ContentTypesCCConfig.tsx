import {
	ContentTypeFieldSchema,
	FieldSchema,
	FormSchema,
	FormValues,
} from '@redactie/form-renderer-module';
import { omit } from 'ramda';
import React, { FC, ReactElement, useMemo } from 'react';

import { DynamicFieldSettingsContext } from '../../../components/Fields';
import formRendererConnector from '../../../connectors/formRenderer';
import { ContentTypesCCRouteProps } from '../../../contentTypes.types';
import { generateFRFieldFromCTField } from '../../../helpers';
import { Field, Validation } from '../../../services/contentTypes';
import { ValicationCheckWithAllowedFields } from '../../../services/contentTypes/contentTypes.service.types';
import { FieldTypeData } from '../../../services/fieldTypes';
import { ContentTypeFieldDetailModel } from '../../../store/contentTypes';
import { PresetDetailModel } from '../../../store/presets';

import { ALLOWED_FORM_HEADERS } from './ContentTypesCCConfig.const';

const ContentTypesCCConfig: FC<ContentTypesCCRouteProps> = ({
	CTField,
	fieldType,
	formikRef,
	preset,
	onSubmit,
	dynamicFieldSettingsContext,
}) => {
	/**
	 * Hooks
	 */

	const dynamicFieldSettingsContextValue = useMemo(
		() => ({
			activeField: CTField,
			...(dynamicFieldSettingsContext || {}),
		}),
		[CTField, dynamicFieldSettingsContext]
	);

	const spreadIfObject = (item: any): any =>
		typeof item === 'object' && item !== null ? { ...item } : item;

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
		const { config = {} } = CTField;

		if (preset && Array.isArray(config.fields)) {
			return config.fields.reduce((initialValues: FormValues, field: Field) => {
				// Spreads are necessary because Formik seems to mark objects as readonly ¯\_(ツ)_/¯
				initialValues[field.name] = spreadIfObject(field.config);
				const presetField = preset.data.fields.find(f => f.field.name === field.name);

				if (Array.isArray(presetField?.formSchema?.fields)) {
					presetField?.formSchema?.fields.forEach(f => {
						if (field.config[f.name]) {
							initialValues[presetField.field.name][f.name] =
								initialValues[field.name][f.name];
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

	const generateFormSchemaFromFieldTypeData = (fieldTypeData: FieldTypeData): FormSchema => {
		const valueSyncMap = formRendererConnector.api.getValueSyncMap(
			fieldTypeData?.formSchema?.fields as ContentTypeFieldSchema[]
		);

		return {
			fields: formRendererConnector.api.parseFields(
				fieldTypeData?.formSchema?.fields as ContentTypeFieldSchema[],
				{
					valueSyncMap,
				}
			),
		};
	};

	const schema: FormSchema = useMemo(
		() =>
			preset
				? generateFormSchemaFromPreset(preset)
				: generateFormSchemaFromFieldTypeData(fieldType.data),
		[fieldType, preset]
	);
	const validationSchema: Record<string, any> = useMemo(() => {
		const schema: Record<string, any> = preset
			? preset?.validateSchema.configuration
			: fieldType?.validateSchema.configuration;

		return {
			...omit(['schema'])(schema),
			$schema: schema.schema,
		};
	}, [fieldType, preset]);
	const errorMessages: Record<string, string> = useMemo(
		() =>
			preset
				? preset.errorMessages?.configuration || {}
				: fieldType?.errorMessages?.configuration || {},
		[fieldType, preset]
	);

	/**
	 * Methods
	 */

	const generateFieldConfig = (
		data: FormValues,
		CTField: ContentTypeFieldDetailModel,
		preset?: PresetDetailModel
	): { config: Record<string, any>; validationChecks: Validation['checks'] } => {
		const newConfig = { ...data };

		if (preset && (CTField.config?.fields || []).length > 0) {
			newConfig['fields'] = CTField.config.fields?.map(field => {
				const fieldConfig = newConfig[field.name];

				return {
					...field,
					config: {
						...(fieldConfig || field.config),
					},
				};
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
			...CTField,
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
		if (!formRendererConnector.api || !hasConfiguration(fieldType.data, preset)) {
			return <p>Er zijn geen configuratie mogelijkheden</p>;
		}

		return (
			<DynamicFieldSettingsContext.Provider value={dynamicFieldSettingsContextValue}>
				<formRendererConnector.api.Form
					formikRef={formikRef}
					initialValues={initialFormValue}
					schema={schema}
					validationSchema={validationSchema}
					errorMessages={errorMessages}
					onChange={onFormSubmit}
					allowedHeaders={ALLOWED_FORM_HEADERS}
					noSync
				/>
			</DynamicFieldSettingsContext.Provider>
		);
	};

	return (
		<>
			<h2 className="h3 u-margin-bottom">Configuratie</h2>
			{renderCCConfig()}
		</>
	);
};

export default ContentTypesCCConfig;
