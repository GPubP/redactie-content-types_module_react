import { FormValues } from '@redactie/form-renderer-module';
import { omit } from 'ramda';
import React, { FC, ReactElement, useMemo } from 'react';

import formRendererConnector from '../../../connectors/formRenderer';
import { ContentTypesCCRouteProps } from '../../../contentTypes.types';
import {
	createInitialValuesFromChecks,
	generateConfigFromValidationData,
	generateValidationChecks,
	parseRequiredToBool,
} from '../../../helpers';
import {
	generateFormSchemaFromFieldTypeData,
	generateFormSchemaFromPreset,
} from '../../../helpers/generateFormSchema';
import { FieldTypeData } from '../../../services/fieldTypes';
import { PresetDetailModel } from '../../../store/presets';

import { ALLOWED_FORM_HEADERS } from './ContentTypesCCValidation.const';

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
			return (
				data.validators.length > 0 ||
				!!data.fields.find(field => field?.validators?.length > 0)
			);
		}
		return !!fieldTypeData?.validators?.length;
	};

	const onFormSubmit = (data: FormValues): void => {
		/**
		 * We need to set the required prop on the generalConfig when a	required validator was set by the user
		 * The form renderer is using this prop to indicate that a field is required
		 */
		const generateGeneralConfig = (data: FormValues = {}): Record<string, any> => {
			const required = parseRequiredToBool(data.required);

			if (required !== null) {
				return {
					...CTField.generalConfig,
					required: required,
				};
			}

			return CTField.generalConfig;
		};

		onSubmit({
			...CTField,
			validation: generateValidationChecks(data, fieldType.data, preset, CTField),
			config: generateConfigFromValidationData(data, preset, CTField?.config, schema),
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
				allowedHeaders={ALLOWED_FORM_HEADERS}
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
