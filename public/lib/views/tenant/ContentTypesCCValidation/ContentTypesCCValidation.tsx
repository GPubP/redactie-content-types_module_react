import { FormValues } from '@redactie/form-renderer-module';
import { omit } from 'ramda';
import React, { FC, ReactElement, useMemo } from 'react';

import formRendererConnector from '../../../connectors/formRenderer';
import { ContentTypesCCRouteProps } from '../../../contentTypes.types';
import { generateValidationChecks } from '../../../helpers';
import {
	generateFormSchemaFromFieldTypeData,
	generateFormSchemaFromPreset,
} from '../../../helpers/generateFormSchema';
import {
	ValicationCheckWithAllowedFields,
	ValicationCheckWithFields,
	ValidationCheck,
	ValidationCheckField,
} from '../../../services/contentTypes';
import { FieldTypeData } from '../../../services/fieldTypes';
import { PresetDetailModel } from '../../../store/presets';

const ContentTypesCCValidation: FC<ContentTypesCCRouteProps> = ({
	CTField,
	fieldType,
	formikRef,
	preset,
	onSubmit,
}) => {
	/**
	 * Hooks
	 */
	const initialFormValue: FormValues = useMemo(() => {
		if (!CTField || !CTField.validation) {
			return {};
		}
		const { validation } = CTField;
		function createInitialValuesFromFields(fields: ValidationCheckField[]): FormValues {
			return fields.reduce((value, field) => {
				// eslint-disable-next-line @typescript-eslint/no-use-before-define
				value[field.name] = createInitialValuesFromChecks(field.checks);
				return value;
			}, {} as FormValues);
		}
		function createInitialValuesFromChecks(
			checks: (
				| ValidationCheck
				| ValicationCheckWithFields
				| ValicationCheckWithAllowedFields
			)[] = []
		): FormValues {
			// NOTE!: We need to set the checks to any because typescript can not reduce over a tuple type
			return (checks as any).reduce((value: FormValues, check: any) => {
				if (check.fields) {
					return {
						...value,
						...createInitialValuesFromFields(check.fields),
					};
				}
				value[check.key] = check.val;
				return value;
			}, {} as FormValues);
		}

		return createInitialValuesFromChecks(validation.checks);
	}, [CTField]);

	const validationSchema: Record<string, any> = useMemo(() => {
		const schema: Record<string, any> = preset
			? preset?.validateSchema.validation.formSchema
			: fieldType?.validateSchema.validation.formSchema;

		return {
			...omit(['schema'])(schema),
			$schema: schema.schema,
		};
	}, [fieldType, preset]);

	const errorMessages: Record<string, string> = useMemo(
		() =>
			preset
				? preset.errorMessages?.validation?.formSchema || {}
				: fieldType.errorMessages?.validation?.formSchema || {},
		[fieldType.errorMessages, preset]
	);

	const schema = useMemo(
		() =>
			preset
				? generateFormSchemaFromPreset(preset)
				: generateFormSchemaFromFieldTypeData(fieldType.data),
		[fieldType.data, preset]
	);

	/**
	 *
	 * Methods
	 */
	const hasValidatorsToConfigure = (
		fieldTypeData: FieldTypeData,
		preset?: PresetDetailModel
	): boolean => {
		if (preset) {
			const { data } = preset;
			return !!data.fields.find(field => field?.validators?.length > 0);
		}
		return !!fieldTypeData?.validators?.length;
	};

	const onFormSubmit = (data: FormValues): void => {
		/**
		 * We need to set the required prop on the generalConfig when a	required validator was set by the user
		 * The form renderer is using this prop to indicate that a field is required
		 */
		const generateConfig = (
			data: FormValues,
			preset?: PresetDetailModel
		): Record<string, any> => {
			return preset
				? Object.keys(data).reduce(
						(acc, fieldName) => {
							const required = data[fieldName]?.required;

							return {
								...acc,
								fields: acc.fields?.map((field: any) => {
									if (field.name === fieldName && typeof required === 'boolean') {
										return {
											...field,
											generalConfig: {
												...field.generalConfig,
												required,
											},
										};
									}
									return field;
								}),
							};
						},
						{
							...CTField.config,
						}
				  )
				: {};
		};

		const generateGeneralConfig = (data: FormValues = {}): Record<string, any> => {
			if (typeof data.required === 'boolean') {
				return {
					...CTField.generalConfig,
					required: data.required,
				};
			}
			return CTField.generalConfig;
		};

		onSubmit({
			...CTField,
			validation: generateValidationChecks(data, fieldType.data, preset),
			config: generateConfig(data, preset),
			generalConfig: generateGeneralConfig(data),
		});
	};

	/**
	 * Render
	 */
	const renderCCValidation = (): ReactElement => {
		if (!formRendererConnector.api || !hasValidatorsToConfigure(fieldType.data, preset)) {
			return <p>Er zijn geen validatie mogelijkheden</p>;
		}

		return (
			<formRendererConnector.api.Form
				formikRef={formikRef}
				schema={schema}
				validationSchema={validationSchema}
				initialValues={initialFormValue}
				errorMessages={errorMessages}
				onChange={onFormSubmit}
			/>
		);
	};

	return (
		<>
			<h2 className="h3 u-margin-bottom">Validatie</h2>
			{renderCCValidation()}
		</>
	);
};

export default ContentTypesCCValidation;
