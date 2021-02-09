import { FieldSchema, FormSchema, FormValues } from '@redactie/form-renderer-module';
import { FormikValues } from 'formik';
import pointer from 'json-pointer';
import { is, prop } from 'ramda';

import {
	DynamicRepeaterItem,
	FieldSchemaForAnchorlink,
	MultipleItem,
	SelectOption,
	TextFieldValue,
} from './Anchorlink.types';

const generateAnchorlinkOption = (fieldPath: string[], value: string): SelectOption => {
	const jsonPointer = pointer.compile(fieldPath);
	return {
		label: value,
		key: jsonPointer,
		value: jsonPointer,
	};
};

const parseFieldNameToPath = (field: FieldSchemaForAnchorlink): string[] => [
	...(field._jsonPointerName ? field._jsonPointerName : [field.name]),
];

const handlePreset = (field: FieldSchemaForAnchorlink, values: FormikValues): SelectOption[] =>
	Object.keys(values).reduce((acc, key: string) => {
		const value = prop(key)(values) as any;
		const subField = field.config?.fields.find((f: FieldSchema) => key === f.name);

		if (!subField || !value) {
			return acc;
		}

		if (
			!subField.config?.textType?.isAnchorlink &&
			is(Object)(value) &&
			!Array.isArray(value) &&
			Array.isArray(subField?.config?.fields)
		) {
			return [
				...acc,
				...handlePreset(
					{
						...subField,
						_jsonPointerName: [...parseFieldNameToPath(field), subField.name],
					},
					value
				),
			];
		}

		if (value?.text && !!subField.config?.textType?.isAnchorlink) {
			return [
				...acc,
				generateAnchorlinkOption([...parseFieldNameToPath(field), `${key}`], value.text),
			];
		}

		return acc;
	}, [] as SelectOption[]);

const handleMultiple = (field: FieldSchemaForAnchorlink, values: FormikValues): SelectOption[] =>
	values.reduce(
		(acc: SelectOption[], value: MultipleItem<TextFieldValue>) =>
			value?.value?.text
				? [
						...acc,
						generateAnchorlinkOption(
							[...parseFieldNameToPath(field), 'uuid', `${value.uuid}`],
							value.value.text
						),
				  ]
				: acc,
		[] as SelectOption[]
	);

const handleParagraph = (field: FieldSchemaForAnchorlink, values: FormikValues): SelectOption[] =>
	values.reduce((acc: SelectOption[], value: DynamicRepeaterItem<TextFieldValue>) => {
		const subField = field.config?.fields.find((f: FieldSchema) => value.fieldRef === f.uuid);

		if (!subField || !value?.value) {
			return acc;
		}

		if (
			!subField.config?.textType?.isAnchorlink &&
			is(Object)(value?.value) &&
			!Array.isArray(value?.value) &&
			Array.isArray(subField.config?.fields)
		) {
			return [
				...acc,
				...handlePreset(
					{
						...subField,
						_jsonPointerName: [...parseFieldNameToPath(field), subField.name],
					},
					value.value
				),
			];
		}

		if (value?.value?.text && !!subField.config?.textType?.isAnchorlink) {
			return [
				...acc,
				generateAnchorlinkOption(
					[...parseFieldNameToPath(field), 'uuid', `${value.uuid}`],
					value.value.text
				),
			];
		}
		return acc;
	}, [] as SelectOption[]);

export const parseAnchorlinkOptions = (
	schema: FormSchema,
	values: FormValues,
	required: boolean
): SelectOption[] =>
	(schema?.fields || []).reduce(
		(acc, field) => {
			// Field is a multiple field
			if (
				Array.isArray(values[field.name]) &&
				field?.config?.max &&
				field.config.max !== 1 &&
				field.config?.textType?.isAnchorlink
			) {
				return [...acc, ...handleMultiple(field, values[field.name])];
			}

			// Field is a preset
			if (
				!field.config?.textType?.isAnchorlink &&
				is(Object)(values[field.name]) &&
				!Array.isArray(values[field.name]) &&
				Array.isArray(field.config?.fields)
			) {
				return [...acc, ...handlePreset(field, values[field.name])];
			}

			// Field is a paragraph
			if (
				!field.config?.textType?.isAnchorlink &&
				Array.isArray(values[field.name]) &&
				Array.isArray(field.config?.fields)
			) {
				return [...acc, ...handleParagraph(field, values[field.name])];
			}

			// Field is not a text field or is not marked as possible anchorlink
			if (!values[field.name]?.text || !field.config?.textType?.isAnchorlink) {
				return acc;
			}

			// Field is a single item
			return [...acc, generateAnchorlinkOption([field.name], values[field.name].text)];
		},
		[
			{
				value: '',
				key: '',
				label: required ? 'Selecteer een anchorlink' : 'Geen anchorlink',
				disabled: required,
			},
		] as SelectOption[]
	);
