import { FieldOption, FieldSchema, FormSchema, FormValues } from '@redactie/form-renderer-module';
import pointer from 'json-pointer';

import { DynamicRepeaterItem } from './Anchorlink.types';

const generateAnchorlinkOption = (fieldPath: string[], value: string): FieldOption['value'] => {
	const jsonPointer = pointer.compile(fieldPath);
	return {
		label: value,
		key: jsonPointer,
		value: jsonPointer,
	};
};

export const parseAnchorlinkOptions = (
	schema: FormSchema,
	values: FormValues,
	required: boolean
): FieldOption['value'][] =>
	(schema?.fields || []).reduce(
		(acc, field) => {
			// Field is a multiple field
			if (
				Array.isArray(values[field.name]) &&
				field?.config?.max &&
				field.config.max !== 1 &&
				field.config?.textType?.isAnchorlink
			) {
				return [
					...acc,
					...values[field.name].reduce(
						(acc: string[], value: { value?: any }, index: number) =>
							value?.value?.text
								? [
										...acc,
										generateAnchorlinkOption(
											[field.name, `${index}`],
											value.value.text
										),
								  ]
								: acc,
						[] as string[]
					),
				];
			}

			// Field is a paragraph
			if (Array.isArray(values[field.name]) && Array.isArray(field.config?.fields)) {
				return [
					...acc,
					...values[field.name].reduce(
						(
							acc: string[],
							value: DynamicRepeaterItem<{ text: string }>,
							index: number
						) =>
							value?.value?.text &&
							!!field.config?.fields.find(
								(field: FieldSchema) =>
									!!field.config?.textType?.isAnchorlink &&
									value.fieldRef === field.uuid
							)
								? [
										...acc,
										generateAnchorlinkOption(
											[field.name, `${index}`],
											value.value.text
										),
								  ]
								: acc,
						[] as string[]
					),
				];
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
		]
	);
