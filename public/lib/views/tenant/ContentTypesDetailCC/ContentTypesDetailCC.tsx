import { Button, Card } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection, Table } from '@acpaas-ui/react-editorial-components';
import { AlertContainer, LeavePrompt, LoadingState, useNavigate } from '@redactie/utils';
import { FormikHelpers } from 'formik';
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
	NEW_CC_FORM_VALIDATION_SCHEMA,
} from '../../../components';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';
import {
	ALERT_CONTAINER_IDS,
	CONTENT_COMPARTMENT_UUID,
	CONTENT_TYPE_DETAIL_TAB_MAP,
	MODULE_PATHS,
} from '../../../contentTypes.const';
import {
	ContentTypesDetailRouteParams,
	ContentTypesDetailRouteProps,
	NewCCFormState,
} from '../../../contentTypes.types';
import { sortFieldTypes } from '../../../helpers';
import { useContentType } from '../../../hooks';
import { Compartment, ContentTypeFieldDetail } from '../../../services/contentTypes';
import { contentTypesFacade } from '../../../store/contentTypes';

import { CONTENT_TYPE_COLUMNS, CT_DETAIL_CC_ALLOWED_PATHS } from './ContentTypesDetailCC.const';
import { ContentTypeDetailCCRow, MoveAction } from './ContentTypesDetailCC.types';

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
	const [expandedRows, setExpandedRows] = useState<Record<string, any>>({});
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

	const onRowExpand = (rowId: string): void => {
		setExpandedRows({
			[rowId]: true,
		});
	};

	const onCompartmentUpdateFormSubmit = (
		uuid: string,
		compartment: Partial<Compartment>
	): void => {
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
						})
					}
					onDelete={() => contentTypesFacade.removeCompartment(row.id)}
					onCancel={() => setExpandedRows({})}
				/>
			</div>
		);
	};

	const moveCompartment = (uuid: string, action: MoveAction): void => {
		const { compartments } = contentType;
		const movedUp = action === MoveAction.UP;
		const compartmentIndex = compartments.findIndex(c => c.uuid === uuid);
		const last = compartments.length - 1 === compartmentIndex;
		const first = compartmentIndex === 0;

		if ((movedUp && first) || (!movedUp && last)) {
			return;
		}

		const nextIndex = movedUp ? compartmentIndex - 1 : compartmentIndex + 1;
		contentTypesFacade.updateCompartments(move(compartmentIndex, nextIndex, compartments));
	};

	const moveField = (uuid: string, action: MoveAction): void => {
		const { compartments, fields } = contentType;
		const movedField = fields.find(f => f.uuid === uuid);

		if (!movedField) {
			return;
		}

		const { uuid: compartmentUuid, position } = movedField.compartment;
		const AllFieldsInCompartment = fields.filter(f => f.compartment.uuid === compartmentUuid);
		const compartmentIndex = compartments.findIndex(c => c.uuid === compartmentUuid);
		const movedUp = action === MoveAction.UP;
		const movedDown = action === MoveAction.DOWN;
		const first = position === 0;
		const last = AllFieldsInCompartment.length - 1 === position;
		const movedUpAndFirst = movedUp && first;
		const movedDownAndLast = movedDown && last;

		const nextCompartment = movedUp
			? compartments[compartmentIndex - 1]
			: compartments[compartmentIndex + 1];

		if ((movedUpAndFirst || movedDownAndLast) && !nextCompartment) {
			return;
		}
		const nextCompartmentFieldLength =
			fields.filter(f => f.compartment.uuid === nextCompartment?.uuid)?.length || 0;

		const nextPosition = movedUp
			? first
				? nextCompartmentFieldLength
				: position - 1
			: last
			? 0
			: position + 1;

		const targetCompartmentUuid =
			movedUpAndFirst || movedDownAndLast ? nextCompartment.uuid : compartmentUuid;

		contentTypesFacade.updateFieldCompartment(
			uuid,
			targetCompartmentUuid,
			position,
			nextPosition,
			false
		);
	};

	const onMoveRow = (uuid: string, action: MoveAction): void => {
		const { compartments, fields } = contentType;
		const movedField = fields.find(f => f.uuid === uuid);
		const movedCompartment = compartments.find(c => c.uuid === uuid);

		if (!movedField) {
			if (movedCompartment) {
				moveCompartment(uuid, action);
			}
			return;
		}

		moveField(uuid, action);
	};

	const onMoveRowDnD = (source: any, target: any): void => {
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

	const canMoveUp = (fieldToMove: ContentTypeFieldDetail): boolean => {
		if (!fieldToMove) {
			return false;
		}

		const { compartments } = contentType;
		const { compartment } = fieldToMove;

		const compartmentIndex = compartments.findIndex(c => c.uuid === compartment.uuid);
		const nextCompartment = compartments[compartmentIndex - 1];
		return !(compartment.position === 0 && !nextCompartment);
	};

	const canMoveDown = (fieldToMove: ContentTypeFieldDetail): boolean => {
		if (!fieldToMove) {
			return false;
		}

		const { compartments, fields } = contentType;
		const { compartment } = fieldToMove;

		const compartmentIndex = compartments.findIndex(c => c.uuid === compartment.uuid);
		const nextCompartment = compartments[compartmentIndex + 1];
		const AllFieldsInCompartment = fields.filter(f => f.compartment.uuid === compartment.uuid);
		return !(AllFieldsInCompartment.length - 1 === compartment.position && !nextCompartment);
	};
	/**
	 * Render
	 */

	const renderTableField = (): ReactElement => {
		const contentTypeRows: ContentTypeDetailCCRow[] = (fieldsByCompartments || []).map(
			(compartment, index) => {
				return {
					id: compartment.uuid,
					label: compartment.label,
					canMoveUp: index > 0,
					canMoveDown: fieldsByCompartments.length - 1 !== index,
					isCompartment: true,
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
						canMoveUp: canMoveUp(cc),
						canMoveDown: canMoveDown(cc),
						isCompartment: false,
						navigate: () =>
							navigate(MODULE_PATHS.detailCCEdit, {
								contentTypeUuid,
								contentComponentUuid: cc.uuid,
							}),
					})),
				};
			}
		);
		return (
			<Table
				dataKey="id"
				className="u-margin-top"
				draggable
				moveRow={onMoveRowDnD}
				columns={CONTENT_TYPE_COLUMNS(t, onRowExpand, onMoveRow)}
				expandedRows={expandedRows}
				rows={contentTypeRows}
				rowExpansionTemplate={updateCompartmentTemplate}
				totalValues={contentType.fields.length}
			/>
		);
	};

	return (
		<>
			<AlertContainer
				toastClassName="u-margin-bottom"
				containerId={ALERT_CONTAINER_IDS.detailCC}
			/>
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
								validationSchema={NEW_CC_FORM_VALIDATION_SCHEMA(
									fieldsByCompartments
								)}
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
