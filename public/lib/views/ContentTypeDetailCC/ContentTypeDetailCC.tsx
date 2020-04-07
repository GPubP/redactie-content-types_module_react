import { Button, Card } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection, Table } from '@acpaas-ui/react-editorial-components';
import { Field, Formik } from 'formik';
import { pathOr } from 'ramda';
import React, { FC, ReactElement } from 'react';

import { FormCTNewCC, NavList } from '../../components';
import { MODULE_PATHS } from '../../contentTypes.const';
import { NewCCFormState } from '../../contentTypes.types';
import { useNavigate } from '../../hooks';
import { ContentTypeFieldSchema } from '../../services/contentTypes';

import {
	CONTENT_TYPE_COLUMNS,
	CT_CC_NAV_LIST_ITEMS,
	CT_CC_VALIDATION_SCHEMA,
} from './ContentTypeDetailCC.const';
import { ContentTypeDetailCCRow, ContenTypeDetailCCProps } from './ContentTypeDetailCC.types';

const ContentTypeDetailCC: FC<ContenTypeDetailCCProps> = ({
	fieldTypes,
	contentType: initialState,
	onSubmit,
}) => {
	const fieldTypeOptions = fieldTypes.map(fieldType => ({
		key: fieldType.uuid,
		value: fieldType.uuid,
		label: fieldType?.data?.label,
	}));

	/**
	 * Hooks
	 */
	const { generatePath, navigate } = useNavigate();

	/**
	 * Methods
	 */
	const onCCFormSubmit = ({ name, fieldType }: any): void => {
		navigate(`${MODULE_PATHS.detailCCNew}?fieldType=:fieldType&name=:name`, {
			contentTypeUuid: initialState.uuid,
			name,
			fieldType,
		});
	};

	/**
	 * Render
	 */
	const renderTableField = ({
		value: fields,
	}: {
		value: ContentTypeFieldSchema[];
	}): ReactElement => {
		const contentTypeRows: ContentTypeDetailCCRow[] = (fields || []).map(
			(cc: ContentTypeFieldSchema) => ({
				path: generatePath(MODULE_PATHS.detailCCEdit, {
					contentTypeUuid: initialState.uuid,
					ccUuid: cc.uuid,
				}),
				label: cc.label,
				name: cc.name,
				fieldType: pathOr('error', ['fieldType', 'data', 'label'])(cc),
				multiple: typeof cc.generalConfig.max === 'number' && cc.generalConfig.max > 0,
				required: !!cc.generalConfig.required,
				translatable: !!cc.generalConfig.multiLanguage,
				hidden: !!cc.generalConfig.hidden,
			})
		);

		return (
			<Table
				className="u-margin-top"
				columns={CONTENT_TYPE_COLUMNS}
				rows={contentTypeRows}
				totalValues={pathOr(0, ['fields', 'length'])(initialState)}
			/>
		);
	};

	const renderTableForm = (): ReactElement => {
		return (
			<Formik
				initialValues={initialState}
				onSubmit={onSubmit}
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
		<>
			<div className="u-container u-wrapper">
				<div className="row between-xs top-xs u-margin-bottom-lg">
					<div className="col-xs-3">
						<NavList items={CT_CC_NAV_LIST_ITEMS} />
						<Button className="u-margin-top" iconLeft="plus" primary>
							Sectie toevoegen
						</Button>
					</div>

					<div className="col-xs-9">{renderDetail()}</div>
				</div>
			</div>
			<ActionBar isOpen>
				<ActionBarContentSection>
					<div className="u-wrapper">
						<Button className="u-margin-right-xs" type="success">
							Bewaar
						</Button>
						<Button outline>Annuleer</Button>
					</div>
				</ActionBarContentSection>
			</ActionBar>
		</>
	);
};

export default ContentTypeDetailCC;
