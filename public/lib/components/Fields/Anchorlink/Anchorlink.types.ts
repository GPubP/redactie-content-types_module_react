import { FormValues, InputFieldProps } from '@redactie/form-renderer-module';
import { FieldProps } from 'formik';

export interface AnchorlinkValue {
	link: string;
	label: string;
}

export interface AnchorlinkFieldProps extends Omit<InputFieldProps, 'fieldProps'> {
	fieldProps: FieldProps<AnchorlinkValue, FormValues>;
}

export interface DynamicRepeaterItem<Value = unknown> {
	value: Value;
	uuid: string;
	type: string;
	fieldRef: string;
	fieldType: string;
	preset?: string;
}
