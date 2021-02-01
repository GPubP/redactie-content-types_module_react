import { FormValues, InputFieldProps } from '@redactie/form-renderer-module';
import { FieldProps } from 'formik';

export interface AnkerlinkValue {
	link: string;
	label: string;
}

export interface AnkerLinkFieldProps extends Omit<InputFieldProps, 'fieldProps'> {
	fieldProps: FieldProps<AnkerlinkValue, FormValues>;
}

export interface DynamicRepeaterItem<Value = unknown> {
	value: Value;
	uuid: string;
	type: string;
	fieldRef: string;
	fieldType: string;
	preset?: string;
}
