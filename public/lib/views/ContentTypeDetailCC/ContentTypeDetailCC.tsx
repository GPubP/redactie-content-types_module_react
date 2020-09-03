import { Button, Card } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	Container,
	Table,
} from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { Field, Formik } from 'formik';
import { path, pathOr } from 'ramda';
import React, { FC, ReactElement, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { FormCTNewCC } from '../../components';
import { useCoreTranslation } from '../../connectors/translations';
import { CONTENT_TYPE_DETAIL_TAB_MAP, MODULE_PATHS } from '../../contentTypes.const';
import {
	ContentTypesDetailRouteProps,
	LoadingState,
	NewCCFormState,
} from '../../contentTypes.types';
import { useContentType, useNavigate } from '../../hooks';
import { ContentTypeFieldDetailModel } from '../../store/contentTypes';

import { CONTENT_TYPE_COLUMNS, CT_CC_VALIDATION_SCHEMA } from './ContentTypeDetailCC.const';
import { ContentTypeDetailCCRow } from './ContentTypeDetailCC.types';

const ContentTypeDetailCC: FC<ContentTypesDetailRouteProps> = ({
	presets,
	fieldTypes,
	contentType,
	onCancel,
	onSubmit,
}) => {
	/**
	 * Hooks
	 */
	const { contentTypeUuid } = useParams();
	const { navigate, generatePath } = useNavigate();
	const [t] = useCoreTranslation();
	const [, contentTypIsUpdating] = useContentType();
	const isLoading = useMemo(() => {
		return contentTypIsUpdating === LoadingState.Loading;
	}, [contentTypIsUpdating]);
	const fields = useMemo(
		() =>
			[...fieldTypes, ...presets].sort((a, b) => {
				const nameA = a.data?.label?.toUpperCase(); // ignore upper and lowercase
				const nameB = b.data?.label?.toUpperCase(); // ignore upper and lowercase

				if (nameA < nameB) {
					return -1;
				}

				if (nameA > nameB) {
					return 1;
				}

				return 0;
			}),
		[fieldTypes, presets]
	);

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

	const renderTableForm = (): ReactElement => {
		return (
			<Formik
				enableReinitialize={true}
				initialValues={{ fields: contentType.fields }}
				onSubmit={onCCSave}
				validationSchema={CT_CC_VALIDATION_SCHEMA}
			>
				{() => <Field name="fields" placeholder="No fields" as={renderTableField} />}
			</Formik>
		);
	};

	const renderDetail = (): ReactElement => {
		return (
			<div>
				<h5>Content componenten</h5>

				{renderTableForm()}

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
		);
	};

	return (
		<Container>
			{renderDetail()}

			<ActionBar className="o-action-bar--fixed" isOpen>
				<ActionBarContentSection>
					<div className="u-wrapper row end-xs">
						<Button onClick={onCancel} negative>
							{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
						</Button>
						<Button
							iconLeft={isLoading ? 'circle-o-notch fa-spin' : null}
							disabled={isLoading}
							className="u-margin-left-xs"
							onClick={onCCSave}
							type="success"
						>
							{t(CORE_TRANSLATIONS.BUTTON_SAVE)}
						</Button>
					</div>
				</ActionBarContentSection>
			</ActionBar>
		</Container>
	);
};

export default ContentTypeDetailCC;
