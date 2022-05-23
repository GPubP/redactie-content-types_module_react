import { Checkbox } from '@acpaas-ui/react-components';
import { LanguageHeader, LanguageHeaderContext } from '@acpaas-ui/react-editorial-components';
import { ContentTypeFieldSchema, FormSchema } from '@redactie/form-renderer-module';
import { LanguagesSchema } from '@redactie/language-module';
import { FormikOnChangeHandler } from '@redactie/utils';
import {
	ContentSchema,
	getSyncedTranslationValue,
	getTranslationSyncMappers,
} from '@wcm/content-mappers';
import { Field, Formik, FormikProps, FormikValues } from 'formik';
import { equals } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';

import formRendererConnector from '../../../connectors/formRenderer';
import { ContentTypesCCRouteProps } from '../../../contentTypes.types';
import {
	fieldsHasMultiLanguage,
	getDefaultValueCompartmentValidation,
	getDefaultValueSchemas,
} from '../../../helpers';
import { ContentTypeFieldDetail, Field as FieldType } from '../../../services/contentTypes';

import { ALLOWED_FORM_HEADERS } from './ContentTypesCCDefaults.const';

const ContentTypesCCDefaults: FC<ContentTypesCCRouteProps> = ({
	CTField,
	formikRef,
	onSubmit,
	fieldType,
	preset,
	activeLanguages,
	hasSubmit,
}) => {
	const initialEditableFormValues = {
		editable: !CTField.generalConfig.disabled,
	};
	const editableFieldDisabled = CTField.generalConfig.hidden;

	/**
	 * Hooks
	 */
	const localFormikRef = useRef<FormikProps<FormikValues>>();
	const [activeLanguage, setActiveLanguage] = useState<LanguagesSchema>();
	const [setErrors, setSetErrors] = useState<(errors: Record<string, string>) => void>();
	const formFields = useMemo(
		() =>
			!Array.isArray(CTField.config.fields) || !CTField.config.fields.length
				? []
				: CTField.config.fields.reduce((acc, field) => {
						return [...acc, field];
				  }, [] as FieldType[]),
		[CTField]
	);
	const isMultiLanguageForm = useMemo(
		() =>
			CTField.generalConfig.multiLanguage &&
			(!Array.isArray(CTField.config.fields) ||
				!CTField.config.fields.length ||
				fieldsHasMultiLanguage(formFields)),
		[CTField.config.fields, CTField.generalConfig.multiLanguage, formFields]
	);
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
				{
					noHiddenFields: true,
					noDisabledFields: true,
					activeLanguageKey: activeLanguage?.key,
				}
			),
		}),
		[CTField, activeLanguage]
	);

	const initialDefaultValueFormValue = useMemo(() => {
		const { defaultValue } = CTField;
		const langDefaultValue = {
			defaultValue:
				(defaultValue?.multiLanguage && activeLanguage
					? defaultValue[activeLanguage.key]
					: defaultValue) || '',
		};

		localFormikRef.current?.setValues(langDefaultValue);

		return langDefaultValue;
	}, [CTField, activeLanguage]);

	const { validationSchema, errorMessages } = useMemo(
		() => getDefaultValueSchemas(CTField, fieldType),
		[CTField, fieldType]
	);

	useEffect(() => {
		if (Array.isArray(activeLanguages) || !isMultiLanguageForm) {
			const primaryLang = activeLanguages.find(l => l.primary) || activeLanguages[0];

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

		if (isMultiLanguageForm && !CTField.defaultValue?.multiLanguage) {
			const translationMappers = getTranslationSyncMappers(formFields as any, {
				includeOptional: true,
			});

			onSubmit({
				...CTField,
				defaultValue: activeLanguages?.reduce(
					(acc, language) => {
						const newLangDefaultValue = language.primary
							? CTField.defaultValue || ''
							: preset
							? getSyncedTranslationValue(
									translationMappers,
									({
										fields: CTField.defaultValue,
									} as unknown) as ContentSchema,
									({ fields: {} } as unknown) as ContentSchema
							  )?.fields
							: '';

						return {
							...acc,
							[language.key]: newLangDefaultValue,
						};
					},
					{ multiLanguage: true }
				),
			});
		}

		if (!isMultiLanguageForm && CTField.defaultValue?.multiLanguage) {
			const primaryLang = activeLanguages.find(l => l.primary) || activeLanguage;

			onSubmit({
				...CTField,
				defaultValue: CTField.defaultValue[primaryLang.key],
			});
		}
	}, [
		CTField,
		activeLanguage,
		activeLanguages,
		formFields,
		isMultiLanguageForm,
		onSubmit,
		preset,
	]);

	useEffect(() => {
		if (hasSubmit && isMultiLanguageForm && setErrors) {
			const validation = getDefaultValueCompartmentValidation(
				CTField,
				fieldType,
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
	}, [CTField, activeLanguages, fieldType, hasSubmit, isMultiLanguageForm]);

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

	const mapAndTransformToMultiLangDefaultValue = (
		CTField: ContentTypeFieldDetail,
		defaultValue: any
	): ContentTypeFieldDetail['defaultValue'] => {
		if (!activeLanguage || !isMultiLanguageForm) {
			return defaultValue;
		}

		const langDefaultValue = {
			...CTField.defaultValue,
			[activeLanguage.key]: defaultValue, // Don't sync fields over languages (fields input are multilanguage)
			multiLanguage: true,
		};

		if (!preset) {
			return langDefaultValue;
		}

		const translationMappers = getTranslationSyncMappers(formFields as any, {
			includeOptional: true,
		});

		return activeLanguages.reduce((defValue, language) => {
			if (language.key === activeLanguage.key) {
				return defValue;
			}

			const newLangDefaultValue = getSyncedTranslationValue(
				translationMappers,
				{ fields: langDefaultValue[activeLanguage.key] } as ContentSchema,
				{ fields: (CTField.defaultValue || {})[language.key] || {} } as ContentSchema
			)?.fields;

			if (equals(newLangDefaultValue, CTField.config[language.key])) {
				return defValue;
			}

			return {
				...defValue,
				[language.key]: newLangDefaultValue,
			};
		}, langDefaultValue);
	};

	const onDefaultValueFormSubmit = (values: FormikValues): void => {
		const multiLanguageDefaultValue = mapAndTransformToMultiLangDefaultValue(
			CTField,
			values.defaultValue
		);
		const newValue = {
			...CTField,
			...values,
			defaultValue: multiLanguageDefaultValue,
		};

		onSubmit(newValue);
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
									key={`default-form-lang-${activeLanguage?.key || 'none'}`}
									formikRef={formikRef}
									schema={parsedFormSchema}
									initialValues={initialDefaultValueFormValue}
									validationSchema={validationSchema}
									errorMessages={errorMessages}
									onChange={values => onDefaultValueFormSubmit(values)}
									allowedHeaders={ALLOWED_FORM_HEADERS}
									noSync={!isMultiLanguageForm}
								/>
							);
						}}
					</LanguageHeaderContext.Consumer>
				</div>
			</LanguageHeader>
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
