import { Button, Card } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection, Table } from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { AlertContainer, LeavePrompt } from '@redactie/utils';
import { FormikHelpers, FormikProps } from 'formik';
import { move, path, pathOr } from 'ramda';
import React, { FC, ReactElement, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import {
	FormCTEditCompartment,
	FormCTEditCompartmentState,
	FormCTNewCC,
	FormCTNewCompartment,
	FormCTNewCompartmentState,
} from '../../../components';
import { useCoreTranslation } from '../../../connectors/translations';
import {
	ALERT_CONTAINER_IDS,
	CONTENT_COMPARTMENT_UUID,
	CONTENT_TYPE_DETAIL_TAB_MAP,
	MODULE_PATHS,
} from '../../../contentTypes.const';
import {
	ContentTypesDetailRouteParams,
	ContentTypesDetailRouteProps,
	LoadingState,
	NewCCFormState,
} from '../../../contentTypes.types';
import { sortFieldTypes } from '../../../helpers';
import { useContentType, useNavigate } from '../../../hooks';
import { Compartment } from '../../../services/contentTypes';
import { contentTypesFacade } from '../../../store/contentTypes';

import { CONTENT_TYPE_COLUMNS, CT_DETAIL_CC_ALLOWED_PATHS } from './ContentTypesDetailCC.const';
import { ContentTypeDetailCCRow } from './ContentTypesDetailCC.types';

const ContentTypeDetailCC: FC<ContentTypesDetailRouteProps> = ({
	presets,
	fieldTypes,
	contentType,
	fieldsByCompartments = [],
	onCancel,
	onSubmit,
	fieldsHaveChanged,
}) => {
	/**
	 * Hooks
	 */
	const { contentTypeUuid } = useParams<ContentTypesDetailRouteParams>();
	const [expandedRows, setExpandedRows] = useState({});
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

	const compartmentOptions = contentType.compartments.map(c => ({
		key: c.uuid,
		value: c.uuid,
		label: c.label,
	}));

	/**
	 * Methods
	 */
	const onCCFormSubmit = ({ name, fieldType, compartment }: NewCCFormState): void => {
		const selectedFieldType = fields.find(ft => ft.uuid === fieldType);
		if (!selectedFieldType) {
			return;
		}

		// check if selectedfieldType is a preset or a fieldType
		// send the fieldtype or preset with a query parameter
		// Only presets have a fieldType prop available on the data object
		const fieldTypeIsPreset = !!selectedFieldType?.data.fieldType;
		const queryParams = fieldTypeIsPreset
			? `?preset=${selectedFieldType.uuid}&name=${name}&compartment=${compartment}`
			: `?fieldType=${selectedFieldType.uuid}&name=${name}&compartment=${compartment}`;

		navigate(`${MODULE_PATHS.detailCCNewSettings}${queryParams}`, {
			contentTypeUuid,
		});
	};

	const onCompartmentFormSubmit = (
		{ name }: FormCTNewCompartmentState,
		formikHelpers: FormikHelpers<FormCTEditCompartmentState>
	): void => {
		const compartment = {
			uuid: uuidv4(),
			label: name,
			removable: true,
		};
		formikHelpers.resetForm();

		// save compartment on content type
		contentTypesFacade.addCompartment(compartment);
	};

	const onCCSave = (): void => {
		onSubmit(contentType.fields, CONTENT_TYPE_DETAIL_TAB_MAP.contentComponents);
	};

	const moveRow = (source: any, target: any): void => {
		const targetCompartmentUuid =
			contentType.fields.find(f => f.uuid === target.id)?.compartment.uuid || target.id;
		const moveFieldToCompartment = source.type === 'row-2' && target.type === 'row-1';
		const moveFieldToField = source.type === 'row-2' && target.type === 'row-2';
		const moveCompartment = source.type === 'row-1' && target.type === 'row-1';
		if (moveCompartment) {
			contentTypesFacade.updateCompartments(
				move(source.index, target.index, contentType.compartments)
			);
			return;
		}

		if (targetCompartmentUuid && (moveFieldToField || moveFieldToCompartment)) {
			contentTypesFacade.updateFieldCompartment(
				source.id,
				targetCompartmentUuid,
				source.index,
				target.index,
				moveFieldToCompartment
			);
		}
	};

	const onRowExpand = (rowId: string): void => {
		setExpandedRows({
			[rowId]: true,
		});
	};

	const onCompartmentUpdateFormSubmit = (uuid: string, compartment: Compartment): void => {
		contentTypesFacade.updateCompartment(uuid, compartment);
		setExpandedRows({});
	};

	const updateCompartmentTemplate = (row: ContentTypeDetailCCRow): ReactElement | null => {
		const compartment = contentType.compartments.find(c => c.uuid === row.id);
		if (!compartment) {
			return null;
		}
		const isRemovable = compartment?.removable;
		return (
			<div className="u-margin-xs">
				<FormCTEditCompartment
					formState={{ name: row.label }}
					isRemovable={isRemovable}
					onSubmit={value =>
						onCompartmentUpdateFormSubmit(row.id, {
							uuid: row.id,
							label: value.name,
							removable: true,
						})
					}
					onDelete={() => contentTypesFacade.removeCompartment(row.id)}
					onCancel={() => setExpandedRows({})}
				/>
			</div>
		);
	};

	const onMoveRowUp = (uuid: string): void => {
		const movedField = contentType.fields.find(f => f.uuid === uuid);

		if (movedField) {
			const { uuid: compartmentUuid, position } = movedField.compartment;
			if (position === 0) {
				const nextCompartmentIndex =
					contentType.compartments.findIndex(c => c.uuid === compartmentUuid) - 1;
				const nextCompartment = contentType.compartments[nextCompartmentIndex];

				if (nextCompartment) {
					const AllFieldsInCompartment = contentType.fields.filter(
						f => f.compartment.uuid === nextCompartment.uuid
					);
					contentTypesFacade.updateFieldCompartment(
						uuid,
						nextCompartment.uuid,
						position,
						AllFieldsInCompartment.length,
						false
					);
					return;
				}
				return;
			}
			contentTypesFacade.updateFieldCompartment(
				uuid,
				compartmentUuid,
				position,
				position - 1,
				false
			);
		}
	};

	const onMoveRowDown = (uuid: string): void => {
		const movedField = contentType.fields.find(f => f.uuid === uuid);

		if (movedField) {
			const { uuid: compartmentUuid, position } = movedField.compartment;
			const AllFieldsInCompartment = contentType.fields.filter(
				f => f.compartment.uuid === compartmentUuid
			);
			if (AllFieldsInCompartment.length - 1 === position) {
				const nextCompartmentIndex =
					contentType.compartments.findIndex(c => c.uuid === compartmentUuid) + 1;
				const nextCompartment = contentType.compartments[nextCompartmentIndex];

				if (nextCompartment) {
					contentTypesFacade.updateFieldCompartment(
						uuid,
						nextCompartment.uuid,
						position,
						0,
						false
					);
					return;
				}
				return;
			}
			contentTypesFacade.updateFieldCompartment(
				uuid,
				compartmentUuid,
				position,
				position + 1,
				false
			);
		}
	};
	/**
	 * Render
	 */

	const renderTableField = (): ReactElement => {
		const contentTypeRows: ContentTypeDetailCCRow[] = (fieldsByCompartments || []).map(
			compartment => {
				return {
					id: compartment.uuid,
					label: compartment.label,
					rows: (compartment?.fields || []).map(cc => ({
						id: cc.uuid,
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
					})),
				};
			}
		);
		return (
			<Table
				dataKey="id"
				className="u-margin-top"
				draggable
				moveRow={moveRow}
				columns={CONTENT_TYPE_COLUMNS(t, onRowExpand, onMoveRowUp, onMoveRowDown)}
				expandedRows={expandedRows}
				rows={contentTypeRows}
				rowExpansionTemplate={updateCompartmentTemplate}
				totalValues={contentType.fields.length}
			/>
		);
	};

	return (
		<>
			<div className="u-margin-bottom">
				<AlertContainer containerId={ALERT_CONTAINER_IDS.detailSites} />
			</div>
			<div className="u-margin-bottom-lg">
				<h5>Content componenten</h5>

				{renderTableField()}

				<div className="u-margin-top">
					<Card>
						<div className="u-margin">
							<h5>Voeg een content componenten toe</h5>
							<FormCTNewCC
								className="u-margin-top"
								fieldTypeOptions={fieldTypeOptions}
								compartmentOptions={compartmentOptions}
								formState={{
									fieldType: '',
									name: '',
									compartment: CONTENT_COMPARTMENT_UUID,
								}}
								onSubmit={onCCFormSubmit}
							/>
						</div>
					</Card>
				</div>
				<div className="u-margin-top">
					<Card>
						<div className="u-margin">
							<h5>Voeg een compartiment toe</h5>
							<FormCTNewCompartment
								className="u-margin-top"
								formState={{ name: '' }}
								onSubmit={onCompartmentFormSubmit}
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
				allowedPaths={CT_DETAIL_CC_ALLOWED_PATHS}
				shouldBlockNavigationOnConfirm
				when={fieldsHaveChanged}
				onConfirm={onCCSave}
			/>
		</>
	);
};

export default ContentTypeDetailCC;
