import { LanguageHeader, LanguageHeaderContext } from '@acpaas-ui/react-editorial-components';
import {
	ContentTypeFieldSchema,
	FieldSchema,
	FormSchema,
	FormValues,
} from '@redactie/form-renderer-module';
import { LanguagesSchema } from '@redactie/language-module';
import {
	ContentSchema,
	getSyncedTranslationValue,
	getTranslationSyncMappers,
} from '@wcm/content-mappers';
import { FormikProps, FormikValues } from 'formik';
import { equals, omit } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';

import { DynamicFieldSettingsContext } from '../../../components/Fields';
import formRendererConnector from '../../../connectors/formRenderer';
import { ContentTypesCCRouteProps } from '../../../contentTypes.types';
import {
	fieldsHasMultiLanguage,
	generateFRFieldFromCTField,
	getConfigurationValidation,
} from '../../../helpers';
import { ContentTypeFieldDetail, Field, Validation } from '../../../services/contentTypes';
import { ValicationCheckWithAllowedFields } from '../../../services/contentTypes/contentTypes.service.types';
import { FieldTypeData } from '../../../services/fieldTypes';
import { Preset } from '../../../services/presets';
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
	activeLanguages,
	hasSubmit,
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
	const localFormikRef = useRef<FormikProps<FormikValues>>();
	const [activeLanguage, setActiveLanguage] = useState<LanguagesSchema>();
	const [setErrors, setSetErrors] = useState<(errors: Record<string, string>) => void>();
	const formFields = useMemo(
		() =>
			!preset
				? fieldType?.data.formSchema?.fields
				: preset.data.fields.reduce((acc, field) => {
						return [...acc, ...field.formSchema.fields];
				  }, [] as Field[]),
		[fieldType.data.formSchema.fields, preset]
	);
	const isMultiLanguageForm = useMemo(
		() => CTField.generalConfig.multiLanguage && fieldsHasMultiLanguage(formFields),
		[CTField.generalConfig.multiLanguage, formFields]
	);

	useEffect(() => {
		if (Array.isArray(activeLanguages) || !isMultiLanguageForm) {
			const primaryLang = activeLanguages?.find(l => l.primary) || activeLanguages[0];

			!activeLanguage || activeLanguage?.key !== primaryLang?.key
				? setActiveLanguage(primaryLang)
				: null;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeLanguages]);

	useEffect(() => {
		if (!Array.isArray(activeLanguages) || !activeLanguage) {
			return;
		}

		const primaryLang = activeLanguages.find(l => l.primary) || activeLanguage;

		if (isMultiLanguageForm && !CTField.config.multiLanguage) {
			const translationMappers = getTranslationSyncMappers(formFields as any, {
				includeOptional: true,
			});

			onSubmit({
				...CTField,
				config: activeLanguages?.reduce(
					(acc, language) => {
						const newLangConfig = getSyncedTranslationValue(
							translationMappers,
							{
								fields: omit(['fields'], CTField.config || {}),
							} as ContentSchema,
							{ fields: CTField.config[language.key] || {} } as ContentSchema
						)?.fields;

						return {
							...acc,
							[language.key]:
								language.key === primaryLang?.key
									? omit(['fields'], CTField.config || {})
									: newLangConfig,
						};
					},
					{ multiLanguage: true, fields: CTField.config.fields || [] }
				),
			});
		}

		if (!isMultiLanguageForm && CTField.config.multiLanguage) {
			onSubmit({
				...CTField,
				config: {
					multiLanguage: false,
					fields: CTField.config.fields || [],
					...(CTField.config[primaryLang.key] || {}),
				},
			});
		}
	}, [
		CTField,
		CTField.config.multiLanguage,
		activeLanguage,
		activeLanguages,
		formFields,
		isMultiLanguageForm,
		onSubmit,
	]);

	useEffect(() => {
		if (hasSubmit && isMultiLanguageForm && setErrors) {
			const validation = getConfigurationValidation(
				CTField,
				fieldType,
				(preset as unknown) as Preset,
				activeLanguages
			);
			setErrors(
				Object.keys(validation).reduce(
					(acc, valKey) => ({
						...acc,
						[valKey]: [validation[valKey]],
					}),
					{}
				)
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [CTField, activeLanguages, fieldType, hasSubmit, isMultiLanguageForm, preset]);

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
		const langConfig =
			(config.multiLanguage && activeLanguage ? config[activeLanguage.key] : config) || {};

		if (preset && Array.isArray(langConfig.fields)) {
			return langConfig.fields.reduce((initialValues: FormValues, field: Field) => {
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

		localFormikRef.current?.setValues(langConfig);

		return langConfig;
	}, [CTField, activeLanguage, preset]);

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
			? preset?.validateSchema?.configuration
			: fieldType?.validateSchema?.configuration;

		return {
			...omit(['schema'])(schema),
			$schema: schema?.schema || {},
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

	const mapAndTransformToMultiLangConfig = (
		CTField: ContentTypeFieldDetail,
		config: Record<string, any>
	): ContentTypeFieldDetail['config'] => {
		if (!activeLanguage || !isMultiLanguageForm) {
			return config;
		}

		const langConfig: Record<string, any> = {
			...CTField.config, // Old to new output (should be temp)
			[activeLanguage.key]: omit(['fields'], config), // Don't sync fields over languages (fields input are multilanguage)
			fields: config?.fields || [],
			multiLanguage: true,
		};
		const translationMappers = getTranslationSyncMappers(formFields as any, {
			includeOptional: true,
		});

		return activeLanguages.reduce((conf, language) => {
			if (language.key === activeLanguage.key) {
				return conf;
			}

			const newLangConfig = getSyncedTranslationValue(
				translationMappers,
				{ fields: langConfig[activeLanguage.key] } as ContentSchema,
				{ fields: CTField.config[language.key] || {} } as ContentSchema
			)?.fields;

			if (equals(newLangConfig, CTField.config[language.key])) {
				return conf;
			}

			return {
				...conf,
				[language.key]: newLangConfig,
			};
		}, langConfig);
	};

	const onFormSubmit = (data: FormValues): void => {
		const config = generateFieldConfig(data, CTField, preset);
		const multiLanguageConfig = mapAndTransformToMultiLangConfig(CTField, config.config);
		const newValue: ContentTypeFieldDetail = {
			...CTField,
			config: multiLanguageConfig,
			...((Array.isArray(config.validationChecks) && config.validationChecks.length > 0
				? { validation: { checks: config.validationChecks } }
				: {}) as Pick<ContentTypeFieldDetail, 'validation'>),
		};

		onSubmit(newValue);
	};

	const createFormikRef = (instance: FormikProps<FormikValues>): void => {
		if (!equals(localFormikRef.current, instance)) {
			localFormikRef.current = instance;
		}

		formikRef ? formikRef(instance) : null;
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
				<LanguageHeader
					languages={activeLanguages}
					activeLanguage={activeLanguage}
					onChangeLanguage={(language: string) => setActiveLanguage({ key: language })}
					isVisible={!!isMultiLanguageForm}
				>
					<div className={isMultiLanguageForm ? 'u-margin-top u-bg-light u-padding' : ''}>
						<LanguageHeaderContext.Consumer>
							{({
								setErrors: setFn,
							}: {
								setErrors: (errors: Record<string, string>) => void;
							}) => {
								setSetErrors(() => setFn);

								return (
									<formRendererConnector.api.Form
										key={`form-lang-${activeLanguage?.key || 'none'}`}
										formikRef={createFormikRef}
										initialValues={initialFormValue}
										schema={schema}
										validationSchema={validationSchema}
										errorMessages={errorMessages}
										onChange={values => onFormSubmit(values)}
										allowedHeaders={ALLOWED_FORM_HEADERS}
										noSync={!isMultiLanguageForm}
									/>
								);
							}}
						</LanguageHeaderContext.Consumer>
					</div>
				</LanguageHeader>
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
