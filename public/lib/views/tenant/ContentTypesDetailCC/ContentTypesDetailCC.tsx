import { Button, Card } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection, Table } from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { LeavePrompt } from '@redactie/utils';
import { Field, Formik } from 'formik';
import { path, pathOr } from 'ramda';
import React, { FC, ReactElement, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { FormCTNewCC } from '../../../components';
import { useCoreTranslation } from '../../../connectors/translations';
import { CONTENT_TYPE_DETAIL_TAB_MAP, MODULE_PATHS } from '../../../contentTypes.const';
import {
	ContentTypesDetailRouteParams,
	ContentTypesDetailRouteProps,
	LoadingState,
	NewCCFormState,
} from '../../../contentTypes.types';
import { sortFieldTypes } from '../../../helpers';
import { useContentType, useNavigate } from '../../../hooks';
import { ContentTypeFieldDetailModel } from '../../../store/contentTypes';

import { CONTENT_TYPE_COLUMNS, CT_CC_VALIDATION_SCHEMA } from './ContentTypesDetailCC.const';
import { ContentTypeDetailCCRow } from './ContentTypesDetailCC.types';

const ContentTypeDetailCC: FC<ContentTypesDetailRouteProps> = ({
	presets,
	fieldTypes,
	contentType,
	onCancel,
	onSubmit,
	fieldsHaveChanged,
}) => {
	/**
	 * Hooks
	 */
	const { contentTypeUuid } = useParams<ContentTypesDetailRouteParams>();
	const { navigate, generatePath } = useNavigate();
	const [t] = useCoreTranslation();
	const [, contentTypeIsUpdating] = useContentType();
	const isLoading = useMemo(() => {
		return contentTypeIsUpdating === LoadingState.Loading;
	}, [contentTypeIsUpdating]);
	const fields = useMemo(() => [...fieldTypes, ...presets].sort(sortFieldTypes), [
		fieldTypes,
		presets,
	]);

	/**
	 * Variables
	 */

	const fieldTypeOptions = fields.map(fieldType => ({
		key: fieldType.uuid,
		value: fieldType.uuid,
		label: fieldType?.data?.label,
	}));

	/**
	 * Methods
	 */
	const onCCFormSubmit = ({ name, fieldType }: NewCCFormState): void => {
		const selectedFieldType = fields.find(ft => ft.uuid === fieldType);
		if (!selectedFieldType) {
			return;
		}

		// check if selectedfieldType is a preset or a fieldType
		// send the fieldtype or preset with a query parameter
		// Only presets have a fieldType prop available on the data object
		const fieldTypeIsPreset = !!selectedFieldType?.data.fieldType;
		const queryParams = fieldTypeIsPreset
			? `?preset=${selectedFieldType.uuid}&name=${name}`
			: `?fieldType=${selectedFieldType.uuid}&name=${name}`;

		navigate(`${MODULE_PATHS.detailCCNewSettings}${queryParams}`, {
			contentTypeUuid,
		});
	};

	const onCCSave = (): void => {
		onSubmit(contentType.fields, CONTENT_TYPE_DETAIL_TAB_MAP.contentComponents);
	};

	/**
	 * Render
	 */

	const renderTableField = ({
		value: fields,
	}: {
		value: ContentTypeFieldDetailModel[];
	}): ReactElement => {
		const contentTypeRows: ContentTypeDetailCCRow[] = (fields || []).map(cc => ({
			path: generatePath(MODULE_PATHS.detailCCEdit, {
				contentTypeUuid,
				contentComponentUuid: cc.uuid,
			}),
			label: cc.label,
			name: cc.name,
			fieldType:
				(path(['preset', 'data', 'label'])(cc) as string | null) ||
				pathOr('error', ['fieldType', 'data', 'label'])(cc),
			multiple: Number(cc.generalConfig.max) > 1,
			required: !!cc.generalConfig.required,
			translatable: !!cc.generalConfig.multiLanguage,
			hidden: !!cc.generalConfig.hidden,
		}));

		return (
			<Table
				className="u-margin-top"
				columns={CONTENT_TYPE_COLUMNS(t)}
				rows={contentTypeRows}
				totalValues={contentType.fields.length}
			/>
		);
	};

	return (
		<>
			<div className="u-margin-bottom-lg">
				<h5>Content componenten</h5>

				<Formik
					enableReinitialize={true}
					initialValues={{ fields: contentType.fields }}
					onSubmit={onCCSave}
					validationSchema={CT_CC_VALIDATION_SCHEMA}
				>
					{() => <Field name="fields" placeholder="No fields" as={renderTableField} />}
				</Formik>

				<div className="u-margin-top">
					<Card>
						<div className="u-margin">
							<h5>Voeg een content componenten toe</h5>
							<FormCTNewCC
								className="u-margin-top"
								fieldTypeOptions={fieldTypeOptions}
								formState={{ fieldType: '', name: '' }}
								onSubmit={onCCFormSubmit}
							/>
						</div>
					</Card>
				</div>
			</div>

			<ActionBar className="o-action-bar--fixed" isOpen>
				<ActionBarContentSection>
					<div className="u-wrapper row end-xs">
						<Button onClick={onCancel} negative>
							{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
						</Button>
						<Button
							iconLeft={isLoading ? 'circle-o-notch fa-spin' : null}
							disabled={isLoading || !fieldsHaveChanged}
							className="u-margin-left-xs"
							onClick={onCCSave}
							type="success"
						>
							{t(CORE_TRANSLATIONS.BUTTON_SAVE)}
						</Button>
					</div>
				</ActionBarContentSection>
			</ActionBar>

			<LeavePrompt
				shouldBlockNavigationOnConfirm={() => true}
				when={fieldsHaveChanged}
				onConfirm={onCCSave}
			/>
		</>
	);
};

export default ContentTypeDetailCC;
