import { FieldSchema, FormSchema, FormValues } from '@redactie/form-renderer-module';
import { equals } from 'ramda';
import React, { FC, ReactElement, useCallback, useMemo, useState } from 'react';

import { AutoSubmit } from '../../components';
import formRendererConnector from '../../connectors/formRenderer';
import { DEFAULT_VALIDATION_SCHEMA } from '../../contentTypes.const';
import { ContentTypesCCRouteProps } from '../../contentTypes.types';
import { generateFRFieldFromCTField, generateValidationChecks } from '../../helpers';
import { usePrevious } from '../../hooks';
import {
	Field,
	ValicationCheckWithFields,
	ValidationCheck,
	ValidationCheckField,
} from '../../services/contentTypes';
import { FieldTypeData } from '../../services/fieldTypes';
import { PresetDetail, Validator } from '../../services/presets';

const ContentTypesCCValidation: FC<ContentTypesCCRouteProps> = ({
	CTField,
	fieldTypeData,
	preset,
	onSubmit,
}) => {
	/**
	 * Hooks
	 */
	const prevValidation = usePrevious(CTField.validation);
	const [initialFormValuesSet, setInitialFormValuesSet] = useState<boolean>(false);

	const onFormSubmit = useCallback(
		(data: FormValues): void => {
			/**
			 * We need to set the required prop on the generalConfig when a	required validator was set by the user
			 * The form renderer is using this prop to indicate that a field is required
			 */
			const generateConfig = (
				data: FormValues,
				preset?: PresetDetail
			): Record<string, any> => {
				return preset
					? Object.keys(data).reduce(
							(acc, fieldName) => {
								const isRequired =
									data[fieldName]?.required === 'true' ||
									data[fieldName]?.required === true;

								return {
									...acc,
									fields: acc.fields?.map((field: any) => {
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
			onSubmit({
				validation: generateValidationChecks(data, fieldTypeData, preset),
				config: generateConfig(data, preset),
			});
		},
		[CTField.config, fieldTypeData, onSubmit, preset]
	);

	const initialFormValue: FormValues = useMemo(() => {
		if (!CTField || !CTField.validation) {
			return {};
		}
		const { validation, __new: useDefaults } = CTField;
		const hasNoValidationChecks = validation?.checks?.length === 0;

		function createChecksFromDefaultValidatorValues(
			validators: Validator[] = []
		): ValidationCheck[] {
			return validators.reduce((checks, validator) => {
				if (validator.data.defaultValue) {
					return [
						...checks,
						...Object.keys(validator.data.defaultValue).map(key => {
							return {
								key,
								val: validator.data.defaultValue[key].val,
								err: '',
							};
						}),
					];
				}
				return checks;
			}, [] as ValidationCheck[]);
		}

		function createInitialValuesFromFields(fields: ValidationCheckField[]): FormValues {
			return fields.reduce((value, field) => {
				// if field.checks is empty, get the default checks
				if (useDefaults && field.checks?.length === 0) {
					const pField = preset?.data.fields.find(
						presetField => presetField.field.name === field.name
					);
					if (pField) {
						const newChecks = createChecksFromDefaultValidatorValues(pField.validators);
						// eslint-disable-next-line @typescript-eslint/no-use-before-define
						value[field.name] = createInitialValuesFromChecks(newChecks);

						return value;
					}
				}

				// eslint-disable-next-line @typescript-eslint/no-use-before-define
				value[field.name] = createInitialValuesFromChecks(field.checks);

				return value;
			}, {} as FormValues);
		}

		function createInitialValuesFromChecks(
			checks: ValidationCheck[] | ValicationCheckWithFields[] = []
		): FormValues {
			// NOTE!: We need to set the checks to any because typescript can not reduce over a tuple type
			return (checks as any).reduce((value: FormValues, check: any) => {
				if (check.fields) {
					return {
						...value,
						...createInitialValuesFromFields(check.fields),
					};
				}

				// TODO: Acpaas ui component Radio Field can not handle boolean values as options
				// Remove this functionality when the issue is fixed
				value[check.key] =
					check.val === true ? 'true' : check.val === false ? 'false' : check.val;

				return value;
			}, {} as FormValues);
		}

		// return the current initial form value when nothing has changed
		if (equals(prevValidation, validation) && initialFormValuesSet) {
			return createInitialValuesFromChecks(validation.checks);
		}

		const result =
			useDefaults && hasNoValidationChecks && !preset
				? createInitialValuesFromChecks(
						// Create checks from default validator values when the CTField is not based on a preset
						// The default validator values are only used when we create a new content type field
						createChecksFromDefaultValidatorValues(fieldTypeData.validators)
				  )
				: createInitialValuesFromChecks(validation.checks);

		// We need save the default values since the form will not trigger an onchange event
		// when the initial values of the from are changed.
		// If we don't do this the default values will be lost
		if (!initialFormValuesSet) {
			setInitialFormValuesSet(true);
			onFormSubmit(result);
		}

		return result;
	}, [
		CTField,
		fieldTypeData.validators,
		initialFormValuesSet,
		onFormSubmit,
		preset,
		prevValidation,
	]);

	/**
	 *
	 * Methods
	 */
	const generateFormSchemaFromPreset = (preset: PresetDetail): FormSchema => ({
		fields: preset?.data?.fields?.reduce((fSchema, field) => {
			if (field.validators?.length > 0) {
				field.validators.forEach(validator =>
					validator.data?.formSchema?.fields.forEach(validatorField =>
						fSchema.push(
							generateFRFieldFromCTField(
								validatorField,
								`${field.field.name}.${validatorField.name}`
							)
						)
					)
				);
			}
			return fSchema;
		}, [] as FieldSchema[]),
	});

	const generateFormSchemaFromFieldTypeData = (fieldTypeData: FieldTypeData): FormSchema => ({
		fields: Array.isArray(fieldTypeData?.validators)
			? fieldTypeData.validators.reduce((acc, validator) => {
					return [
						...acc,
						...validator.data?.formSchema?.fields?.map((validatorField: Field) =>
							generateFRFieldFromCTField(validatorField)
						),
					];
			  }, [])
			: [],
	});

	const hasValidatorsToConfigure = (
		fieldTypeData: FieldTypeData,
		preset?: PresetDetail
	): boolean => {
		if (preset) {
			const { data } = preset;
			return !!data.fields.find(field => field?.validators?.length > 0);
		}
		return !!fieldTypeData?.validators?.length;
	};

	/**
	 * Render
	 */
	const renderCCValidation = (): ReactElement => {
		if (!formRendererConnector.api || !hasValidatorsToConfigure(fieldTypeData, preset)) {
			return <p>Er zijn geen validatie mogelijkheden</p>;
		}

		return (
			<formRendererConnector.api.Form
				schema={
					preset
						? generateFormSchemaFromPreset(preset)
						: generateFormSchemaFromFieldTypeData(fieldTypeData)
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
