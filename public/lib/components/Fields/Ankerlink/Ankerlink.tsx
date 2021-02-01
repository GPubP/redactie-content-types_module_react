import { Select, TextField } from '@acpaas-ui/react-components';
import { FieldOption } from '@redactie/form-renderer-module';
import { FormikValues, useFormikContext } from 'formik';
import debounce from 'lodash.debounce';
import { omit } from 'ramda';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

import formRendererConnector from '../../../connectors/formRenderer';

import { parseAnkerlinkOptions } from './Ankerlink.helpers';
import { AnkerLinkFieldProps, AnkerlinkValue } from './Ankerlink.types';

const Ankerlink: React.FC<AnkerLinkFieldProps> = ({
	fieldProps,
	fieldSchema,
	fieldHelperProps,
}) => {
	const config = fieldSchema.config || {};
	const { field } = fieldProps;
	const { setValue } = fieldHelperProps;
	const FormRendererFieldTitle = (formRendererConnector.api
		.FormRendererFieldTitle as unknown) as React.FC<{
		isRequired: boolean;
		className?: string;
	}>;
	const { schema } = formRendererConnector.api.useFormContext();
	const { values } = useFormikContext<FormikValues>();
	const [ankerlinkOptions, setAnkerlinkOptions] = useState<FieldOption['value'][]>([]);
	// Debounce because calculation shouldn't run on every keystroke (value change)
	const debouncedAnkerlinkOptions = useCallback(
		debounce(
			(schema, values) => setAnkerlinkOptions(parseAnkerlinkOptions(schema, values)),
			1000
		),
		[]
	);

	useEffect(() => {
		if (schema) {
			debouncedAnkerlinkOptions(schema, values);
		}
	}, [debouncedAnkerlinkOptions, schema, values]);

	/**
	 * METHODS
	 */
	const onChange = (value: Partial<AnkerlinkValue>): void => {
		setValue({
			...field.value,
			...value,
		});
	};

	return (
		<>
			<FormRendererFieldTitle isRequired={!!config.required} className="u-margin-bottom">
				{fieldSchema.label}
			</FormRendererFieldTitle>
			{config.description && <p className="u-margin-bottom">{config.description}</p>}
			<div className="u-margin-bottom">
				<Select
					id={`${field.name}.link`}
					name={`${field.name}.link`}
					label="Link"
					options={ankerlinkOptions}
					value={field.value?.link}
					onChange={(event: ChangeEvent<any>) =>
						onChange({
							link: event.target.value,
						})
					}
					{...omit(['multiLanguage', 'min', 'max', 'options'])(config)}
				/>
				<formRendererConnector.api.ErrorMessage name={`${field.name}.link`} />
			</div>
			<div>
				<TextField
					id={`${field.name}.label`}
					name={`${field.name}.label`}
					label="Label"
					component={TextField}
					value={field.value?.label}
					onChange={(event: ChangeEvent<any>) =>
						onChange({
							label: event.target.value,
						})
					}
					{...omit(['multiLanguage', 'min', 'max'])(config)}
				/>
				<formRendererConnector.api.ErrorMessage name={`${field.name}.label`} />
			</div>
			<formRendererConnector.api.ErrorMessage name={field.name} />
		</>
	);
};

export default Ankerlink;
