import { Select, TextField } from '@acpaas-ui/react-components';
import { FormikValues, useFormikContext } from 'formik';
import debounce from 'lodash.debounce';
import { find, omit, propEq } from 'ramda';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

import formRendererConnector from '../../../connectors/formRenderer';

import { parseAnchorlinkOptions } from './Anchorlink.helpers';
import { AnchorlinkFieldProps, AnchorlinkValue, SelectOption } from './Anchorlink.types';

const Anchorlink: React.FC<AnchorlinkFieldProps> = ({
	fieldProps,
	fieldSchema,
	fieldHelperProps,
}) => {
	const config = fieldSchema.config || {};
	const { field } = fieldProps;
	const { setValue } = fieldHelperProps;
	const FormRendererFieldTitle = formRendererConnector.api.FormRendererFieldTitle;
	const { schema } = formRendererConnector.api.useFormContext();
	const { values } = useFormikContext<FormikValues>();
	const [anchorlinkOptions, setAnchorlinkOptions] = useState<SelectOption[]>([]);
	// Debounce because calculation shouldn't run on every keystroke (value change)
	const debouncedAnchorlinkOptions = useCallback(
		debounce(
			(schema, values, required) =>
				setAnchorlinkOptions(parseAnchorlinkOptions(schema, values, required)),
			1000
		),
		[]
	);

	useEffect(() => {
		if (schema) {
			debouncedAnchorlinkOptions(schema, values, config.required);
		}
	}, [config.required, debouncedAnchorlinkOptions, schema, values]);

	/**
	 * METHODS
	 */
	const onChange = (value: Partial<AnchorlinkValue>): void => {
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
					options={anchorlinkOptions}
					value={field.value?.link}
					onChange={(event: ChangeEvent<any>) =>
						onChange({
							link: event.target.value,
							label: find(propEq('value', event.target.value), anchorlinkOptions)
								?.label,
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
					onChange={(event: ChangeEvent<HTMLInputElement>) =>
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

export default Anchorlink;
