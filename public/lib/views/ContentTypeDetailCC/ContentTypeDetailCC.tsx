import { Button, Card } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	Container,
	Table,
} from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { Field, Formik } from 'formik';
import kebabCase from 'lodash.kebabcase';
import { pathOr } from 'ramda';
import React, { FC, ReactElement, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { FormCTNewCC, NavList } from '../../components';
import { useCoreTranslation } from '../../connectors/translations';
import { CONTENT_TYPE_DETAIL_TAB_MAP, MODULE_PATHS } from '../../contentTypes.const';
import { generateFieldFromType } from '../../contentTypes.helpers';
import { ContentTypesDetailRouteProps, NewCCFormState } from '../../contentTypes.types';
import { useNavigate } from '../../hooks';
import { FieldType } from '../../services/fieldTypes';
import { ContentTypeFieldDetailModel, contentTypesFacade } from '../../store/contentTypes';
import { presetsFacade } from '../../store/presets';

import {
	CONTENT_TYPE_COLUMNS,
	CT_CC_NAV_LIST_ITEMS,
	CT_CC_VALIDATION_SCHEMA,
} from './ContentTypeDetailCC.const';
import { ContentTypeDetailCCRow } from './ContentTypeDetailCC.types';

const ContentTypeDetailCC: FC<ContentTypesDetailRouteProps> = ({
	presets,
	fieldTypes,
	onCancel,
	onSubmit,
	state,
}) => {
	const fields = useMemo(() => [...fieldTypes, ...presets], [fieldTypes, presets]);

	const fieldTypeOptions = fields.map(fieldType => ({
		key: fieldType.uuid,
		value: fieldType.uuid,
		label: fieldType?.data?.label,
	}));

	/**
	 * Hooks
	 */
	const { contentTypeUuid } = useParams();
	const { navigate, generatePath } = useNavigate();
	const [t] = useCoreTranslation();

	/**
	 * Methods
	 */
	const onCCFormSubmit = ({ name, fieldType }: NewCCFormState): void => {
		const selectedFieldType = fields.find(ft => ft.uuid === fieldType);
		if (!selectedFieldType) {
			return;
		}

		const initialValues = { label: name, name: kebabCase(name) };

		// Check if the selected fieldType is based on a preset
		// Only presets have a fieldType prop available on the data object
		const fieldTypeIsPreset = !!selectedFieldType?.data.fieldType;
		const workingFieldType = fieldTypeIsPreset
			? (fields.find(ft => ft._id === selectedFieldType?.data.fieldType) as FieldType)
			: (selectedFieldType as FieldType);

		if (fieldTypeIsPreset) {
			// fetch the preset detail
			presetsFacade.getPreset(selectedFieldType.uuid).then(presetDetail => {
				if (presetDetail) {
					contentTypesFacade.setActiveField(
						generateFieldFromType(workingFieldType, initialValues, presetDetail.uuid)
					);
					navigate(MODULE_PATHS.detailCCNew, { contentTypeUuid });
				}
			});
		}

		contentTypesFacade.setActiveField(generateFieldFromType(workingFieldType, initialValues));
		navigate(MODULE_PATHS.detailCCNew, { contentTypeUuid });
	};

	const onCCSave = (): void => {
		onSubmit(state.fields, CONTENT_TYPE_DETAIL_TAB_MAP.contentComponents);
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
			path: generatePath(MODULE_PATHS.detailCCEdit, { contentTypeUuid }),
			setActiveField: () => {
				contentTypesFacade.setActiveField(cc);
			},
			label: cc.label,
			name: cc.name,
			fieldType: pathOr('error', ['fieldType', 'data', 'label'])(cc),
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
				totalValues={state.fields.length}
			/>
		);
	};

	const renderTableForm = (): ReactElement => {
		return (
			<Formik
				initialValues={{ fields: state.fields }}
				onSubmit={onCCSave}
				validationSchema={CT_CC_VALIDATION_SCHEMA}
			>
				{() => <Field name="fields" placeholder="No fields" as={renderTableField} />}
			</Formik>
		);
	};

	const renderDetail = (): ReactElement => {
		return (
			<Card>
				<div className="u-margin">
					<h5>Content componenten</h5>

					{renderTableForm()}

					<div className="u-margin-top">
						<Card>
							<div className="u-margin">
								<h5>Voeg een content componenten toe</h5>
								<FormCTNewCC
									fieldTypeOptions={fieldTypeOptions}
									formState={{ fieldType: '', name: '' }}
									onSubmit={onCCFormSubmit}
								/>
							</div>
						</Card>
					</div>
				</div>
			</Card>
		);
	};

	return (
		<Container>
			<div className="row between-xs top-xs">
				<div className="col-xs-3">
					<NavList items={CT_CC_NAV_LIST_ITEMS} />
					<Button className="u-margin-top" iconLeft="plus" primary>
						Sectie toevoegen
					</Button>
				</div>

				<div className="col-xs-9">{renderDetail()}</div>
			</div>
			<ActionBar className="o-action-bar--fixed" isOpen>
				<ActionBarContentSection>
					<div className="u-wrapper row end-xs">
						<Button onClick={onCancel} negative>
							{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
						</Button>
						<Button className="u-margin-left-xs" onClick={onCCSave} type="success">
							{t(CORE_TRANSLATIONS.BUTTON_SAVE)}
						</Button>
					</div>
				</ActionBarContentSection>
			</ActionBar>
		</Container>
	);
};

export default ContentTypeDetailCC;
