import { Button, Card, Select, TextField } from '@acpaas-ui/react-components';
import { Table } from '@acpaas-ui/react-editorial-components';
import { Field, Formik } from 'formik';
import { pathOr } from 'ramda';
import React, { FC } from 'react';

import { StatusIcon } from '../../components/StatusIcon/StatusIcon';
import { ContentTypeFieldSchema } from '../../services/contentTypes';
import { FieldTypesSchema } from '../../services/fieldTypes';

import { CT_CC_VALIDATION_SCHEMA } from './ContentTypeDetailCC.const';
import { ContentTypeDetailCCRow, ContenTypeDetailCCProps } from './ContentTypeDetailCC.types';
import { DummyCTs } from './_temp.cts';

const ContentTypeDetailCC: FC<ContenTypeDetailCCProps> = ({
	fieldTypes,
	onSubmit,
	tenantId,
	history,
}) => {
	const initialState = DummyCTs[0];

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

		const contentTypeColumns = [
			{
				label: 'Naam',
				value: 'label',
			},
			{
				label: 'type',
				value: 'fieldType',
			},
			{
				label: 'Meerdere',
				value: 'multiple',
				component(value: any, rowData: ContentTypeDetailCCRow) {
					return <StatusIcon active={rowData.multiple} />;
				},
			},
			{
				label: 'Verplicht',
				value: 'required',
				component(value: any, rowData: ContentTypeDetailCCRow) {
					return <StatusIcon active={rowData.required} />;
				},
			},
			{
				label: 'Vertaalbaar',
				value: 'translatable',
				component(value: any, rowData: ContentTypeDetailCCRow) {
					return <StatusIcon active={rowData.translatable} />;
				},
			},
			{
				label: 'Verborgen',
				value: 'hidden',
				component(value: any, rowData: ContentTypeDetailCCRow) {
					return <StatusIcon active={rowData.hidden} />;
				},
			},
		];

		return (
			<Table
				className="u-margin-top"
				columns={contentTypeColumns}
				rows={contentTypeRows}
				totalValues={pathOr(0, ['fields', 'length'])(initialState)}
			></Table>
		);
	};

	const CTCCListTableForm: FC = () => {
		return (
			<Formik
				initialValues={initialState}
				onSubmit={onSubmit}
				validationSchema={CT_CC_VALIDATION_SCHEMA}
			>
				{() => <Field name="fields" placeholder="No fields" as={TableField} />}
			</Formik>
		);
	};

	const CTNewCCForm: FC<{ fieldTypes: FieldTypesSchema }> = ({ fieldTypes }) => {
		const options = fieldTypes.map(fieldType => ({
			key: fieldType.uuid,
			value: fieldType.uuid,
			label: fieldType?.data?.label,
		}));

		return (
			<Formik
				initialValues={{}}
				onSubmit={(formValue: any) =>
					history.push(
						`/${tenantId}/content-types/aanmaken/content-componenten/nieuw?name=${formValue.name}&field-type=${formValue.fieldType}`
					)
				}
			>
				{({ submitForm }) => (
					<>
						<div className="row u-margin-top u-margin-bottom">
							<div className="col-xs-6">
								<Field
									label="Selecteer"
									placeholder="Selecteer een content component"
									name="fieldType"
									options={options}
									as={Select}
								/>
								<div className="u-text-light u-margin-top-xs">
									Selecteer een content component van een bepaald type.
								</div>
							</div>
							<div className="col-xs-6">
								<Field
									type="text"
									label="Naam"
									name="name"
									placeholder="Typ een naam"
									as={TextField}
								/>
								<div className="u-text-light u-margin-top-xs">
									Kies een gebruiksvriendelijke redactie naam, bijvoorbeeld
									&apos;Titel&apos;.
								</div>
							</div>
						</div>
						<Button onClick={submitForm} outline>
							Toevoegen
						</Button>
					</>
				)}
			</Formik>
		);
	};

	const CTCCDetail: FC<{ fieldTypes: FieldTypesSchema }> = ({ fieldTypes }) => {
		return (
			<Card>
				<div className="u-margin">
					<h5>Content componenten</h5>

					<CTCCListTableForm />

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
