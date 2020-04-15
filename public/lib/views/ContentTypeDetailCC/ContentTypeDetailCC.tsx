import { Button, Card } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	Container,
	Table,
} from '@acpaas-ui/react-editorial-components';
import { Field, Formik } from 'formik';
import { omit, pathOr } from 'ramda';
import React, { FC, ReactElement } from 'react';

import { FormCTNewCC, NavList } from '../../components';
import { CONTENT_TYPE_DETAIL_TAB_MAP, MODULE_PATHS } from '../../contentTypes.const';
import { parseContentTypeField } from '../../contentTypes.helpers';
import { ContentTypesDetailRouteProps, NewCCFormState } from '../../contentTypes.types';
import { useNavigate } from '../../hooks';
import { ContentTypeFieldResponse, ContentTypeFieldSchema } from '../../services/contentTypes';
import { internalService } from '../../store/internal';

import {
	CONTENT_TYPE_COLUMNS,
	CT_CC_NAV_LIST_ITEMS,
	CT_CC_VALIDATION_SCHEMA,
} from './ContentTypeDetailCC.const';
import { ContentTypeDetailCCRow } from './ContentTypeDetailCC.types';

const ContentTypeDetailCC: FC<ContentTypesDetailRouteProps> = ({
	fieldTypes,
	contentType,
	onCancel,
	onSubmit,
	state,
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
	const onCCFormSubmit = ({ name, fieldType }: NewCCFormState): void => {
		const currentFieldType = fieldTypes.find(ft => ft.uuid === fieldType);
		navigate(`${MODULE_PATHS.detailCCNew}?fieldType=:fieldType&id=:id&name=:name`, {
			contentTypeUuid: contentType.uuid,
			id: currentFieldType?._id || '',
			name,
			fieldType,
		});
	};

	const onCCSave = (): void => {
		const cleanFields = state.fields.map(parseContentTypeField);
		onSubmit(cleanFields, CONTENT_TYPE_DETAIL_TAB_MAP.contentComponents);
	};

	const navigateToCC = (activeField: ContentTypeFieldResponse): void => {
		internalService.updateActiveField(activeField);
		navigate(MODULE_PATHS.detailCCEdit, { contentTypeUuid: contentType.uuid });
	};

	/**
	 * Render
	 */
	const renderTableField = ({
		value: fields,
	}: {
		value: (ContentTypeFieldResponse | ContentTypeFieldSchema)[];
	}): ReactElement => {
		const contentTypeRows: ContentTypeDetailCCRow[] = (fields || []).map(cc => ({
			navigate: () => {
				navigateToCC(cc as ContentTypeFieldResponse);
			},
			label: cc.label,
			name: cc.name,
			fieldType: pathOr('error', ['fieldType', 'data', 'label'])(cc),
			multiple: typeof cc.generalConfig.max === 'number' && cc.generalConfig.max > 0,
			required: !!cc.generalConfig.required,
			translatable: !!cc.generalConfig.multiLanguage,
			hidden: !!cc.generalConfig.hidden,
		}));

		return (
			<Table
				className="u-margin-top"
				columns={CONTENT_TYPE_COLUMNS}
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
					<div className="u-wrapper">
						<Button className="u-margin-right-xs" onClick={onCCSave} type="success">
							Bewaar
						</Button>
						<Button onClick={onCancel} outline>
							Annuleer
						</Button>
					</div>
				</ActionBarContentSection>
			</ActionBar>
		</Container>
	);
};

export default ContentTypeDetailCC;
