import { Card } from '@acpaas-ui/react-components';
import { Table } from '@acpaas-ui/react-editorial-components';
import { InputFieldProps } from '@redactie/form-renderer-module';
import classNames from 'classnames/bind';
import { useFormikContext } from 'formik';
import { __, compose, equals, pathOr } from 'ramda';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import formRendererConnector from '../../../connectors/formRenderer';
import { useCoreTranslation } from '../../../connectors/translations';
import { DYNAMIC_FIELD_SETTINGS_NAME, MODULE_PATHS } from '../../../contentTypes.const';
import { LoadingState, NewCCFormState } from '../../../contentTypes.types';
import { sortFieldTypes } from '../../../helpers';
import useActiveField from '../../../hooks/useActiveField/useActiveField';
import useDynamicField from '../../../hooks/useDynamicField/useDynamicField';
import useFieldTypes from '../../../hooks/useFieldTypes/useFieldTypes';
import useNavigate from '../../../hooks/useNavigate/useNavigate';
import usePresets from '../../../hooks/usePresets/usePresets';
import { Field } from '../../../services/contentTypes/contentTypes.service.types';
import { dynamicFieldFacade } from '../../../store/dynamicField/dynamicField.facade';
import { FieldTypeListModel } from '../../../store/fieldTypes';
import DataLoader from '../../DataLoader/DataLoader';
import { FormCTNewCC } from '../../forms';
import { FormCTNewCCProps } from '../../forms/FormCTNewCC/FormCTNewCC.types';

import { DYNAMIC_CC_COLUMNS } from './DynamicFieldSettings.const';
import styles from './DynamicFieldSettings.module.scss';
import { DynamicFieldCCRow } from './DynamicFieldSettings.types';

const cx = classNames.bind(styles);

const DynamicFieldSettings: React.FC<InputFieldProps> = ({
	fieldSchema,
	fieldProps,
}: InputFieldProps) => {
	/**
	 * HOOKS
	 */
	const { contentTypeUuid } = useParams<{ contentTypeUuid: string }>();
	const { setFieldValue, values } = useFormikContext<Record<string, { config: Field[] }>>();
	const activeField = useActiveField();
	const dynamicField = useDynamicField();
	const [, fieldTypes] = useFieldTypes();
	const { navigate, generatePath } = useNavigate();
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
			dynamicFieldFacade.setDynamicField(activeField);
		}
	}, [activeField, dynamicField]);

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
		if (equals(value, values[fieldSchema.name]?.config)) {
			return;
		}

		setFieldValue(fieldSchema.name, {
			config: value,
			validation: {
				type: 'array',
				allowedFields: (Array.isArray(value) ? value : []).map(field => ({
					type: field.validation?.type,
					fieldType: field.fieldType.uuid,
					checks: field.validation?.checks,
				})),
			},
		});
	}, [value, fieldSchema.name, setFieldValue, values]);

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

		navigate(
			MODULE_PATHS.detailCCEditDynamicNewSettings,
			{
				contentTypeUuid,
				contentComponentUuid: activeField?.uuid,
			},
			undefined,
			new URLSearchParams(
				fieldTypeIsPreset
					? { preset: selectedFieldType.uuid }
					: { fieldType: selectedFieldType.uuid }
			)
		);
	};

	/**
	 * RENDER
	 */

	const renderTableField = (values: Field[]): ReactElement => {
		const contentTypeRows: DynamicFieldCCRow[] = values.map(cc => ({
			id: cc.uuid,
			path: generatePath(MODULE_PATHS.detailCCEditDynamicEditSettings, {
				contentTypeUuid,
				contentComponentUuid: activeField?.uuid,
				dynamicContentComponentUuid: cc.uuid,
			}),
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
				className="u-margin-top"
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
