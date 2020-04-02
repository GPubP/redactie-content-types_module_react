import { Table } from '@acpaas-ui/react-editorial-components';
import { Button, Card } from '@acpaas-ui/react-components';
import { Field, Formik } from 'formik';
import { init, pathOr } from 'ramda';
import React, { FC } from 'react';

import { CCForm } from '../../components';
import { ContentTypeFieldSchema, ContentTypeSchema } from '../../services/contentTypes';
import { FieldTypesSchema } from '../../services/fieldTypes';

import { CONTENT_TYPE_COLUMNS, CT_CC_VALIDATION_SCHEMA } from './ContentTypeDetailCC.const';
import { ContentTypeDetailCCRow, ContenTypeDetailCCProps } from './ContentTypeDetailCC.types';
import { DummyCTs } from './_temp.cts';

const ContentTypeDetailCC: FC<ContenTypeDetailCCProps> = ({
	fieldTypes,
	contentType: initialState,
	onSubmit,
	tenantId,
	history,
}) => {
	/**
	 * Hooks
	 */

	/**
	 * Methods
	 */

	/**
	 * Render
	 */

	const CTCCNavigtion: FC = () => {
		return (
			<>
				<ul className="m-nav-list">
					<li>
						<a className="is-active" href="#compartiment1">
							Compartiment 1
						</a>
					</li>
					<li>
						<a href="#compartiment2">Compartiment 2</a>
					</li>
					<li>
						<a href="#compartiment3">Compartiment 3</a>
					</li>
				</ul>
				<Button className="u-margin-top" iconLeft="plus" primary>
					Sectie toevoegen
				</Button>
			</>
		);
	};

	const TableField = ({
		value: fields,
	}: {
		value: ContentTypeFieldSchema[];
	}): React.ReactElement => {
		const contentTypeRows: ContentTypeDetailCCRow[] = (fields || []).map(
			(cc: ContentTypeFieldSchema) => ({
				label: cc.label,
				name: cc.name,
				fieldType: cc.fieldType,
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

	const CTCCListTableForm: FC<{
		initialValues: any;
		onSubmit: (contentType: ContentTypeSchema) => void;
	}> = ({ initialValues, onSubmit: onFormSubmit }) => {
		return (
			<Formik
				initialValues={initialValues}
				onSubmit={onFormSubmit}
				validationSchema={CT_CC_VALIDATION_SCHEMA}
			>
				{() => <Field name="fields" placeholder="No fields" as={TableField} />}
			</Formik>
		);
	};

	const CTCCDetail: FC<{ fieldTypes: FieldTypesSchema }> = ({ fieldTypes }) => {
		return (
			<Card>
				<div className="u-margin">
					<h5>Content componenten</h5>

					<CTCCListTableForm initialValues={initialState} onSubmit={onSubmit} />

					<div className="u-margin-top">
						<Card>
							<div className="u-margin">
								<h5>Voeg een content componenten toe</h5>
								<CTNewCCForm fieldTypes={fieldTypes} />
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
					<CTCCNavigtion />
				</div>

				<div className="col-xs-9">
					<CTCCDetail fieldTypes={fieldTypes} />
				</div>
			</div>
		</div>
	);
};

export default ContentTypeDetailCC;
