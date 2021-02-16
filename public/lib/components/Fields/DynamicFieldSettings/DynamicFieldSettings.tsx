import { Card } from '@acpaas-ui/react-components';
import { Table } from '@acpaas-ui/react-editorial-components';
import { InputFieldProps } from '@redactie/form-renderer-module';
import { DataLoader, LoadingState } from '@redactie/utils';
import classNames from 'classnames/bind';
import { useFormikContext } from 'formik';
import { __, compose, equals, pathOr } from 'ramda';
import React, { ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import formRendererConnector from '../../../connectors/formRenderer';
import { useCoreTranslation } from '../../../connectors/translations';
import { DYNAMIC_FIELD_SETTINGS_NAME } from '../../../contentTypes.const';
import { NewCCFormState } from '../../../contentTypes.types';
import { sortFieldTypes } from '../../../helpers';
import useFieldTypes from '../../../hooks/useFieldTypes/useFieldTypes';
import usePresets from '../../../hooks/usePresets/usePresets';
import { Field } from '../../../services/contentTypes/contentTypes.service.types';
import { FieldTypeListModel } from '../../../store/fieldTypes';
import { FormCTNewCC } from '../../forms';
import { FormCTNewCCProps } from '../../forms/FormCTNewCC/FormCTNewCC.types';

import { DYNAMIC_CC_COLUMNS } from './DynamicFieldSettings.const';
import DynamicFieldSettingsContext from './DynamicFieldSettings.context';
import styles from './DynamicFieldSettings.module.scss';
import { DynamicFieldCCRow, DynamicFieldFormikContextValues } from './DynamicFieldSettings.types';

const cx = classNames.bind(styles);

const DynamicFieldSettings: React.FC<InputFieldProps> = ({
	fieldSchema,
	fieldProps,
}: InputFieldProps) => {
	/**
	 * HOOKS
	 */
	const history = useHistory();
	const {
		activeField,
		dynamicField,
		setDynamicField = () => null,
		getCreatePath = () => '',
		getEditPath = () => '',
	} = useContext(DynamicFieldSettingsContext);
	const { setFieldValue, values } = useFormikContext<DynamicFieldFormikContextValues>();
	const [, fieldTypes] = useFieldTypes();
	const [, presets] = usePresets();
	const value: Field[] = pathOr([], ['config', 'fields'])(dynamicField);
	const fields = useMemo(() => [...fieldTypes, ...presets].sort(sortFieldTypes), [
		fieldTypes,
		presets,
	]);
	const [fieldTypeOptions, setFieldTypeOptions] = useState<FormCTNewCCProps['fieldTypeOptions']>(
		[]
	);
	const [t] = useCoreTranslation();
	const { field } = fieldProps;

	useEffect(() => {
		if (!activeField) {
			return;
		}

		if (!dynamicField || dynamicField.uuid !== activeField.uuid) {
			setDynamicField(activeField);
		}
	}, [activeField, dynamicField, setDynamicField]);

	useEffect(() => {
		setFieldTypeOptions(
			fields
				// Filter out dynamic field settings
				.filter(fieldType => {
					const hasNestedDynamicFieldSettings = !!(
						(fieldType as FieldTypeListModel).data?.formSchema?.fields || []
					).find(field => field.fieldType.data.name === DYNAMIC_FIELD_SETTINGS_NAME);

					return !hasNestedDynamicFieldSettings;
				})
				.map(fieldType => ({
					key: fieldType.uuid,
					value: fieldType.uuid,
					label: fieldType?.data?.label,
				}))
		);
	}, [fields]);

	useEffect(() => {
		if (
			equals(value, values[fieldSchema.name]?.config) &&
			values[fieldSchema.name]?.validation.checks[0].val === values.amount.minValue &&
			values[fieldSchema.name]?.validation.checks[1].val === values.amount.maxValue
		) {
			return;
		}

		setFieldValue(fieldSchema.name, {
			config: value,
			validation: {
				type: 'array',
				allowedFields: (Array.isArray(value) ? value : []).map(field => ({
					type: field.validation?.type,
					fieldType: field.fieldType.uuid,
					uuid: field.uuid,
					min: field.generalConfig.min,
					max: field.generalConfig.max,
					checks: field.validation?.checks,
				})),
				...(values?.amount
					? {
							checks: [
								{
									key: 'minItems',
									val: values.amount.minValue,
									err: 'Voeg op zen minst ${params.limit} item(s) toe',
								},
								{
									key: 'maxItems',
									val: values.amount.maxValue,
									err: 'Er zijn maximum ${params.limit} item(s) toegelaten',
								},
							],
					  }
					: {}),
			},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, fieldSchema.name, values]);

	/**
	 * VARIABLES
	 */

	/**
	 * METHODS
	 */
	const addItem = (item: NewCCFormState): void => {
		const selectedFieldType = fields.find(ft => ft.uuid === item.fieldType);

		if (!selectedFieldType) {
			return;
		}

		// check if selectedfieldType is a preset or a fieldType
		// send the fieldtype or preset with a query parameter
		// Only presets have a fieldType prop available on the data object
		const fieldTypeIsPreset = !!selectedFieldType?.data.fieldType;

		history.push(getCreatePath(fieldTypeIsPreset, selectedFieldType.uuid));
	};

	/**
	 * RENDER
	 */

	const renderTableField = (values: Field[]): ReactElement => {
		const contentTypeRows: DynamicFieldCCRow[] = values.map(cc => ({
			id: cc.uuid,
			path: getEditPath(cc.uuid),
			label: cc.label,
			name: cc.name,
			fieldType: compose<Field, string, string>(
				(pathOr<string>(
					(__ as unknown) as string,
					['preset', 'data', 'label'],
					cc
				) as unknown) as (x: string) => string,
				pathOr<string>('error', ['fieldType', 'data', 'label'])
			)(cc),
			multiple: Number(cc.generalConfig.max) > 1,
			required: !!cc.generalConfig.required,
			translatable: !!cc.generalConfig.multiLanguage,
			hidden: !!cc.generalConfig.hidden,
		}));

		return (
			<Table
				fixed
				className="u-margin-top"
				tableClassName="a-table--fixed--sm"
				columns={DYNAMIC_CC_COLUMNS(t)}
				rows={contentTypeRows}
				totalValues={fields.length}
			/>
		);
	};

	const renderArrayElements = (values: Field[]): ReactElement => {
		if (!values?.length) {
			return (
				<div className={cx('m-dynamic-field__no-content', 'u-margin-top')}>
					Er zijn geen items om weer te geven.
				</div>
			);
		}

		return renderTableField(values);
	};

	const renderForm = (): ReactElement => (
		<div>
			{fieldSchema.config?.description ? (
				<p className="u-margin-top"> {fieldSchema.config.description} </p>
			) : null}
			<div>
				{renderArrayElements(value)}

				<Card className="u-margin-top">
					<FormCTNewCC
						className="u-margin"
						hasName={false}
						fieldTypeOptions={fieldTypeOptions}
						formState={{ fieldType: '', name: '' }}
						onSubmit={item => addItem(item)}
					/>
				</Card>
				<formRendererConnector.api.ErrorMessage name={field.name} />
			</div>
		</div>
	);

	return (
		<DataLoader
			loadingState={activeField ? LoadingState.Loaded : LoadingState.Loading}
			render={renderForm}
		/>
	);
};

export default DynamicFieldSettings;
