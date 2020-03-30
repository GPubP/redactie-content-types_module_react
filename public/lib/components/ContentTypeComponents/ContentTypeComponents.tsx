import { Button, Card, Select, TextField } from '@acpaas-ui/react-components';
import { Table } from '@acpaas-ui/react-editorial-components';
import { Field, Formik } from 'formik';
import { compose, map, pathOr, propOr } from 'ramda';
import React, { FC } from 'react';

import { ContentTypeFieldSchema } from '../../content-types.types';

import { CT_CC_VALIDATION_SCHEMA } from './ContentTypeComponents.const';
import { ContentTypeRow, ContenTypeCCProps } from './ContentTypeComponents.types';
import { DummyCTs } from './_temp.cts';

const ContentTypeComponents: FC<ContenTypeCCProps> = ({ contentType, onSubmit }) => {
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

	const Status = (active: boolean): React.ReactElement => {
		return (
			<div className="u-text-center">
				{active ? (
					<span className="u-text-success fa fa-check"></span>
				) : (
					<span className="u-text-danger fa fa-close"></span>
				)}
			</div>
		);
	};

	const TableField = ({
		field,
		form,
		...props
	}: {
		field: any;
		form: FormData;
	}): React.ReactElement => {
		console.log(field);
		const contentTypeRows: ContentTypeRow[] = compose(
			map((cc: ContentTypeFieldSchema) => ({
				label: cc.label,
				name: cc.name,
				fieldType: cc.fieldType,
				multiple: typeof cc.generalConfig.max === 'number' && cc.generalConfig.max > 0,
				required: !!cc.generalConfig.required,
				translatable: !!cc.generalConfig.multiLanguage,
				hidden: !!cc.generalConfig.hidden,
			})),
			propOr([], 'fields')
		)(initialState);

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
				component: (value: any, rowData: ContentTypeRow) => Status(rowData.multiple),
			},
			{
				label: 'Verplicht',
				value: 'required',
				component: (value: any, rowData: ContentTypeRow) => Status(rowData.required),
			},
			{
				label: 'Vertaalbaar',
				value: 'translatable',
				component: (value: any, rowData: ContentTypeRow) => Status(rowData.translatable),
			},
			{
				label: 'Verborgen',
				value: 'hidden',
				component: (value: any, rowData: ContentTypeRow) => Status(rowData.hidden),
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

	return (
		<div className="u-container u-wrapper u-margin-top u-margin-bottom-lg">
			<div className="row between-xs top-xs">
				<ul className="col-xs-3 m-nav-list">
					<li>
						<a href="#compartiment1">Compartiment 1</a>
					</li>
					<li>
						<a className="is-active" href="#">
							Compartiment 2
						</a>
					</li>
					<li>
						<a href="#compartiment2">Compartiment 2</a>
					</li>
				</ul>

				<div className="col-xs-9">
					<Card>
						<div className="u-margin">
							<h5>Content componenten</h5>
							<Formik
								initialValues={initialState}
								onSubmit={onSubmit}
								validationSchema={CT_CC_VALIDATION_SCHEMA}
							>
								{({ submitForm, values }) => (
									<Field
										name="fields"
										placeholder="No fields"
										component={TableField}
									/>
								)}
							</Formik>
							<div className="u-margin-top">
								<Card>
									<div className="u-margin">
										<h5>Voeg een content componenten toe</h5>
										<Formik
											initialValues={{}}
											onSubmit={() => console.log('submit')}
										>
											{({ submitForm, values }) => (
												<>
													<div className="row u-margin-top u-margin-bottom">
														<Field
															className="col-xs-6"
															as="select"
															name="fieldType"
															component={({
																className,
																...props
															}: any) => (
																<div className={className}>
																	<Select
																		{...props}
																		label="Selecteer"
																		options={[
																			{
																				key: '0',
																				value:
																					'2100 Deurne',
																				label:
																					'2100 Deurne',
																			},
																			{
																				key: '1',
																				value:
																					'2030 Antwerpen',
																				label:
																					'2030 Antwerpen',
																			},
																			{
																				key: '2',
																				value:
																					'2200 Merksem',
																				label:
																					'2200 Merksem',
																			},
																			{
																				key: '3',
																				value:
																					'2040 Brasschaat',
																				label:
																					'2040 Brasschaat',
																			},
																		]}
																	/>
																	<div className="u-text-light u-margin-top-xs">
																		Selecteer een content
																		component van een bepaald
																		type.
																	</div>
																</div>
															)}
														></Field>
														<Field
															className="col-xs-6"
															type="text"
															name="label"
															placeholder="Typ een naam"
															component={({
																className,
																...props
															}: any) => (
																<div className={className}>
																	<TextField
																		label="Naam"
																		{...props}
																	/>

																	<div className="u-text-light u-margin-top-xs">
																		Kies een
																		gebruiksvriendelijke
																		redactie naam, bijvoorbeeld
																		&apos;Titel&apos;.
																	</div>
																</div>
															)}
														/>
													</div>
													<Button outline>Toevoegen</Button>
												</>
											)}
										</Formik>
									</div>
								</Card>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default ContentTypeComponents;
