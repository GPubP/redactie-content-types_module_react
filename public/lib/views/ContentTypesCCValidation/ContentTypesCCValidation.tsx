import { FieldSchema, FormSchema, FormValues } from '@redactie/form-renderer-module';
import React, { FC, ReactElement, useMemo } from 'react';

import { AutoSubmit } from '../../components';
import formRendererConnector from '../../connectors/formRenderer';
import { DEFAULT_VALIDATION_SCHEMA } from '../../contentTypes.const';
import { ContentTypesCCRouteProps } from '../../contentTypes.types';
import { generateValidationChecks } from '../../helpers';
import {
	ValicationCheckWithFields,
	ValidationCheck,
	ValidationCheckField,
} from '../../services/contentTypes';
import { FieldTypeData } from '../../services/fieldTypes';
import { PresetDetail } from '../../services/presets';

const ContentTypesCCValidation: FC<ContentTypesCCRouteProps> = ({
	CTField,
	fieldTypeData,
	preset,
	onSubmit,
}) => {
	/**
	 * Hooks
	 */
	const initialFormValue = useMemo(() => {
		const { validation } = CTField;

		function reduceFields(fields: ValidationCheckField[]): FormValues {
			return fields.reduce((value, field) => {
				// eslint-disable-next-line @typescript-eslint/no-use-before-define
				value[field.name] = reduceChecks(field.checks);

				return value;
			}, {} as FormValues);
		}

		function reduceChecks(checks: ValidationCheck[] | ValicationCheckWithFields[]): FormValues {
			// NOTE!: We need to set the checks to any because typescript can not reduce over a tuple type
			return (checks as any).reduce((value: FormValues, check: any) => {
				if (check.fields) {
					return {
						...value,
						...reduceFields(check.fields),
					};
				}

				value[check.key] = check.val;

				return value;
			}, {} as FormValues);
		}

		if (validation && Array.isArray(validation.checks) && validation.checks.length > 0) {
			return reduceChecks(validation.checks);
		}
	}, [CTField]);

	/**
	 *
	 * Methods
	 */
	const createFormSchemaFromPreset = (preset: PresetDetail): FormSchema => ({
		fields: preset?.data?.fields?.reduce((fSchema, field) => {
			if (Array.isArray(field.validators) && field.validators?.length > 0) {
				field.validators.forEach(validator => {
					validator.data?.formSchema?.fields.forEach(validatorField => {
						fSchema.push({
							name: `${field.field.name}.${validatorField.name}`,
							module: validatorField.fieldType?.data?.module || 'core',
							label: validatorField.label,
							type: validatorField.fieldType?.data?.componentName,
							config: validatorField.config,
							dataType: validatorField.dataType?.data?.type,
						});
					});
				});
			}
			return fSchema;
		}, [] as FieldSchema[]),
	});

	const createFormSchemaFromfieldTypeData = (fieldTypeData: FieldTypeData): FormSchema => ({
		fields: Array.isArray(fieldTypeData?.validators)
			? fieldTypeData.validators.map(validator => {
					return validator.data?.formSchema?.fields?.map((validatorField: any) => ({
						name: validatorField.name,
						module: validatorField.fieldType?.data?.module || 'core',
						label: validatorField.label,
						type: validatorField.fieldType?.data?.componentName,
						config: validatorField.config,
						dataType: validatorField.dataType?.data?.type,
					}));
			  })
			: [],
	});

	const hasValidatorsToConfigure = (preset?: PresetDetail): boolean => {
		if (preset) {
			const { data } = preset;
			return !!data.fields.find(field => field?.validators?.length > 0);
		}
		return !!fieldTypeData?.validators?.length;
	};

	/**
	 * We need to set the required prop on the generalConfig when a	required validator was set by the user
	 * The form renderer is using this prop to indicate that a field is required
	 */
	const createConfig = (data: FormValues, preset?: PresetDetail): Record<string, any> => {
		return preset
			? Object.keys(data).reduce(
					(acc, fieldName) => {
						const isRequired =
							data[fieldName].required === 'true' ||
							data[fieldName].required === true;

						return {
							...acc,
							fields: acc.fields.map((field: any) => {
								if (field.name === fieldName && isRequired) {
									return {
										...field,
										generalConfig: {
											...field.generalConfig,
											required: true,
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

	const onFormSubmit = (data: FormValues): void => {
		onSubmit({
			validation: generateValidationChecks(data, fieldTypeData, preset),
			config: createConfig(data, preset),
		});
	};

	/**
	 * Render
	 */
	const renderCCValidation = (): ReactElement => {
		if (!formRendererConnector.api || !hasValidatorsToConfigure(preset)) {
			return <p>Er zijn geen validatie mogelijkheden</p>;
		}

		return (
			<formRendererConnector.api.Form
				schema={
					preset
						? createFormSchemaFromPreset(preset)
						: createFormSchemaFromfieldTypeData(fieldTypeData)
				}
				validationSchema={DEFAULT_VALIDATION_SCHEMA}
				initialValues={initialFormValue}
				onSubmit={onFormSubmit}
				errorMessages={{}}
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
			<h6 className="u-margin-bottom">Validatie</h6>
			{renderCCValidation()}
		</>
	);
};

export default ContentTypesCCValidation;
