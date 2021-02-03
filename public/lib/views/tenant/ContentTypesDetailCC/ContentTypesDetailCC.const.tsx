import { Button, ButtonGroup } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip, TooltipTypeMap } from '@acpaas-ui/react-editorial-components';
import { TranslateFunc } from '@redactie/translations-module';
import { isNil } from 'ramda';
import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { StatusIcon } from '../../../components';
import { CORE_TRANSLATIONS } from '../../../connectors/translations';
import { MODULE_PATHS, TENANT_ROOT } from '../../../contentTypes.const';
import { TableColumn } from '../../../contentTypes.types';

import { ContentTypeDetailCCRow, MoveAction } from './ContentTypesDetailCC.types';

const renderEllipsisWithTooltip = (value: string): ReactElement => (
	<EllipsisWithTooltip type={TooltipTypeMap.PRIMARY}>{value}</EllipsisWithTooltip>
);

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
						<div className="u-margin-left-xs u-min-w-0">
							{path ? (
								<Link to={path}>{renderEllipsisWithTooltip(value)}</Link>
							) : (
								<p className="u-text-bold">{renderEllipsisWithTooltip(value)}</p>
							)}
							{name && (
								<p className="u-text-light">
									{renderEllipsisWithTooltip(`systeemnaam: [${name}]`)}
								</p>
							)}
						</div>
					</div>
				</>
			);
		},
	},
	{
		label: t(CORE_TRANSLATIONS.TABLE_TYPE),
		value: 'fieldType',
		width: '150px',
		ellipsis: true,
		disableSorting: true,
	},
	{
		label: 'Meerdere',
		value: 'multiple',
		disableSorting: true,
		width: '100px',
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
		width: '100px',
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
		width: '100px',
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
		width: '100px',
		disableSorting: true,
		classList: ['u-text-center'],
		component(value: any, rowData: ContentTypeDetailCCRow) {
			return !isNil(rowData.hidden) ? <StatusIcon active={rowData.hidden ?? false} /> : null;
		},
	},
	{
		label: '',
		disableSorting: true,
		width: '100px',
		classList: ['is-condensed', 'u-text-right'],
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
