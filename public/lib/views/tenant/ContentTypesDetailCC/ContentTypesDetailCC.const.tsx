import { Button, ButtonGroup } from '@acpaas-ui/react-components';
import { TranslateFunc } from '@redactie/translations-module';
import { isNil } from 'ramda';
import React from 'react';
import { Link } from 'react-router-dom';

import { StatusIcon } from '../../../components';
import { CORE_TRANSLATIONS } from '../../../connectors/translations';
import { MODULE_PATHS, TENANT_ROOT } from '../../../contentTypes.const';
import { TableColumn } from '../../../contentTypes.types';

import { ContentTypeDetailCCRow, MoveAction } from './ContentTypesDetailCC.types';

export const CONTENT_TYPE_COLUMNS = (
	t: TranslateFunc,
	onExpand: (id: string) => void = () => null,
	moveRow: (uuid: string, action: MoveAction) => void = () => null
): TableColumn<ContentTypeDetailCCRow>[] => [
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'label',
		disableSorting: true,
		component(value: string, rowData: ContentTypeDetailCCRow) {
			const { name, path } = rowData;
			return (
				<>
					<div className="u-flex u-flex-align-center u-flex-no-wrap">
						<ButtonGroup direction="vertical">
							<Button
								onClick={() => moveRow(rowData.id, MoveAction.UP)}
								icon="chevron-up"
								ariaLabel="Move item up"
								type="primary"
								htmlType="button"
								size="tiny"
								transparent
								disabled={!rowData.canMoveUp}
								negative
							/>
							<Button
								onClick={() => moveRow(rowData.id, MoveAction.DOWN)}
								icon="chevron-down"
								ariaLabel="Move item down"
								type="primary"
								htmlType="button"
								size="tiny"
								disabled={!rowData.canMoveDown}
								transparent
								negative
							/>
						</ButtonGroup>
						<div className="u-margin-left-xs">
							{path ? (
								<Link to={path}>{value}</Link>
							) : (
								<p className="u-text-bold">{value}</p>
							)}
							{name && <p className="u-text-light">systeemnaam: [{name}]</p>}
						</div>
					</div>
				</>
			);
		},
	},
	{
		label: t(CORE_TRANSLATIONS.TABLE_TYPE),
		value: 'fieldType',
		disableSorting: true,
	},
	{
		label: 'Meerdere',
		value: 'multiple',
		disableSorting: true,
		classList: ['u-text-center'],
		component(value: any, rowData: ContentTypeDetailCCRow) {
			return !isNil(rowData.multiple) ? (
				<StatusIcon active={rowData.multiple ?? false} />
			) : null;
		},
	},
	{
		label: 'Verplicht',
		value: 'required',
		classList: ['u-text-center'],
		disableSorting: true,
		component(value: any, rowData: ContentTypeDetailCCRow) {
			return !isNil(rowData.required) ? (
				<StatusIcon active={rowData.required ?? false} />
			) : null;
		},
	},
	{
		label: 'Vertaalbaar',
		value: 'translatable',
		disableSorting: true,
		classList: ['u-text-center'],
		component(value: any, rowData: ContentTypeDetailCCRow) {
			return !isNil(rowData.translatable) ? (
				<StatusIcon active={rowData.translatable ?? false} />
			) : null;
		},
	},
	{
		label: 'Verborgen',
		value: 'hidden',
		disableSorting: true,
		classList: ['u-text-center'],
		component(value: any, rowData: ContentTypeDetailCCRow) {
			return !isNil(rowData.hidden) ? <StatusIcon active={rowData.hidden ?? false} /> : null;
		},
	},
	{
		label: '',
		disableSorting: true,
		classList: ['is-condensed'],
		component(value: any, rowData: ContentTypeDetailCCRow) {
			return (
				<Button
					ariaLabel="Edit"
					icon="edit"
					onClick={() =>
						rowData.navigate && typeof rowData.navigate === 'function'
							? rowData.navigate()
							: onExpand(rowData.id)
					}
					type="primary"
					transparent
				/>
			);
		},
	},
];

export const CT_DETAIL_CC_ALLOWED_PATHS = [
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEdit}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCNew}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCNewSettings}`,
];
