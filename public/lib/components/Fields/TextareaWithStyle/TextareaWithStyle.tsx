import { Select, Textarea } from '@acpaas-ui/react-components';
import { InputFieldProps } from '@redactie/form-renderer-module';
import React, { ChangeEvent, useEffect, useMemo } from 'react';

import formRendererConnector from '../../../connectors/formRenderer';

const TextareaWithStyle: React.FC<InputFieldProps> = ({
	fieldSchema,
	fieldProps,
	fieldHelperProps,
}: InputFieldProps) => {
	const config = fieldSchema.config || {};
	const { field } = fieldProps;
	const { setValue } = fieldHelperProps;
	const value: { text: string; textType: string } = field.value as any;
	const showField = Array.isArray(config.allowedOptions) && config.allowedOptions.length >= 2;
	const defaultTextTypeValue: string = Array.isArray(config.allowedOptions)
		? config.allowedOptions[0] || 'none'
		: 'none';

	/**
	 * HOOKS
	 */
	const options = useMemo(
		() =>
			(formRendererConnector.api as any).filterAllowedOptions(
				config.options,
				config.allowedOptions
			),
		[config.options, config.allowedOptions]
	);

	// Handle config change of multiple allowed options to single allowed or other allowed
	useEffect(() => {
		if (
			typeof value === 'object' &&
			!value.textType &&
			value.textType !== defaultTextTypeValue
		) {
			setValue({
				...value,
				textType: defaultTextTypeValue,
			});
		}

		if (!value && defaultTextTypeValue) {
			setValue({
				textType: defaultTextTypeValue,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defaultTextTypeValue, showField]);

	/**
	 * METHODS
	 */
	const updateValue = (newPartialValue: Partial<{ text: string; textType: string }>): void => {
		setValue({
			...(value || {}),
			...(!showField ? { textType: defaultTextTypeValue } : {}),
			...newPartialValue,
		});
	};

	/**
	 * RENDER
	 */
	return (
		<>
			<div className="row">
				<div className="col-xs">
					<div className="a-input">
						<Textarea
							id={`${field.name}.text`}
							name={`${field.name}.text`}
							label={fieldSchema.label}
							value={value?.text}
							onChange={(event: ChangeEvent<any>) =>
								updateValue({ text: event.target.value })
							}
							required={config.required}
							placeholder={config.placeholder}
						/>
						<formRendererConnector.api.ErrorMessage name={`${field.name}.text`} />
					</div>
				</div>
				{showField ? (
					<div className="col-xs-3">
						<div className="a-input">
							<Select
								id={`${field.name}.textType`}
								name={`${field.name}.textType`}
								label="Opmaak"
								options={options}
								value={value?.textType}
								onChange={(event: ChangeEvent<any>) => {
									updateValue({ textType: event.target.value });
								}}
								required={config.required}
							/>
							<formRendererConnector.api.ErrorMessage
								name={`${field.name}.textType`}
							/>
						</div>
					</div>
				) : (
					<>
						<input
							id={`${field.name}.textType`}
							name={`${field.name}.textType`}
							value={defaultTextTypeValue}
							type="hidden"
						/>
						<formRendererConnector.api.ErrorMessage name={`${field.name}.textType`} />
					</>
				)}
			</div>
			{config.description && (
				<div className="u-margin-bottom-xs u-margin-top-xs">
					<small>{config.description}</small>
				</div>
			)}
			<formRendererConnector.api.ErrorMessage name={fieldSchema.name} />
		</>
	);
};

export default TextareaWithStyle;
