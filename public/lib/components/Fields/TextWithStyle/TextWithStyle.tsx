import { Select, TextField } from '@acpaas-ui/react-components';
import { InputFieldProps } from '@redactie/form-renderer-module';
import React, { ChangeEvent, useEffect, useMemo } from 'react';

import formRendererConnector from '../../../connectors/formRenderer';

const TextWithStyle: React.FC<InputFieldProps> = ({
	fieldSchema,
	fieldProps,
	fieldHelperProps,
}: InputFieldProps) => {
	const config = fieldSchema.config || {};
	const { field } = fieldProps;
	const { setValue } = fieldHelperProps;
	const value: { text: string; textType: string } = field.value as any;
	const showField = Array.isArray(config.allowedOptions) && config.allowedOptions.length >= 2;
	const hiddenTextTypeValue: string = Array.isArray(config.allowedOptions)
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
			!showField &&
			typeof value === 'object' &&
			value?.textType &&
			value.textType !== hiddenTextTypeValue
		) {
			setValue({
				...value,
				textType: hiddenTextTypeValue,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hiddenTextTypeValue, showField]);

	/**
	 * METHODS
	 */
	const updateValue = (newPartialValue: Partial<{ text: string; textType: string }>): void => {
		setValue({
			...((field.value as any) || {}),
			...(!showField ? { textType: hiddenTextTypeValue } : {}),
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
						<TextField
							id={`${field.name}.text`}
							name={`${field.name}.text`}
							label={fieldSchema.label}
							value={value?.text}
							required={config.required}
							placeholder={config.placeholder}
							onChange={(event: ChangeEvent<any>) =>
								updateValue({ text: event.target.value })
							}
						/>
						<formRendererConnector.api.ErrorMessage name={`${field.name}.text`} />
					</div>
				</div>
				{showField ? (
					<div className="col-xs-3">
						<div className="a-input u-margin-top">
							<Select
								id={`${field.name}.textType`}
								name={`${field.name}.textType`}
								options={options}
								value={value?.textType}
								onChange={(event: ChangeEvent<any>) =>
									updateValue({ textType: event.target.value })
								}
								required={config.required}
								placeholder={config.stylePlaceholder}
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
							value={hiddenTextTypeValue}
							type="hidden"
						/>
						<formRendererConnector.api.ErrorMessage name={`${field.name}.textType`} />
					</>
				)}
			</div>
			{config.description && <small>{config.description}</small>}
			<formRendererConnector.api.ErrorMessage name={field.name} />
		</>
	);
};

export default TextWithStyle;
