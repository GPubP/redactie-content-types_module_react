import { Button, Card } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection, Table } from '@acpaas-ui/react-editorial-components';
import { Field, Formik } from 'formik';
import { stringify } from 'query-string';
import { pathOr } from 'ramda';
import React, { FC, ReactElement } from 'react';

import { FormCTNewCC, NavList } from '../../components';
import { MODULE_PATHS } from '../../contentTypes.const';
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
	const { navigate } = useNavigate();

	/**
	 * Methods
	 */
	const onCCFormSubmit = ({ name, fieldType }: any): void => {
		navigate(`${MODULE_PATHS.createCCnew}?${stringify({ name, fieldType })}`);
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
			></Table>
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
									formState={{}}
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
		<div className="u-container u-wrapper u-margin-top u-margin-bottom-lg">
			<div className="row between-xs top-xs">
				<div className="col-xs-3">
					<NavList items={CT_CC_NAV_LIST_ITEMS} />
					<Button className="u-margin-top" iconLeft="plus" primary>
						Sectie toevoegen
					</Button>
				</div>

				<div className="col-xs-9">{renderDetail()}</div>

				<ActionBar className="o-action-bar" show>
					<ActionBarContentSection>
						<Button>Bewaar</Button>
						<Button>Annuleer</Button>
					</ActionBarContentSection>
				</ActionBar>
			</div>
		</div>
	);
};

export default ContentTypeDetailCC;
