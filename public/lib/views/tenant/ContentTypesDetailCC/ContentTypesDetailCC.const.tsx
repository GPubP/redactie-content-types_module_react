import { Button, ButtonGroup } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip } from '@acpaas-ui/react-editorial-components';
import { TranslateFunc } from '@redactie/translations-module';
import { TableColumn } from '@redactie/utils';
import { isNil } from 'ramda';
import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { StatusIcon } from '../../../components';
import { CORE_TRANSLATIONS } from '../../../connectors/translations';
import { MODULE_PATHS, TENANT_ROOT } from '../../../contentTypes.const';

import { ContentTypeDetailCCRow, MoveAction } from './ContentTypesDetailCC.types';

const renderEllipsisWithTooltip = (value: string): ReactElement => (
	<EllipsisWithTooltip>{value}</EllipsisWithTooltip>
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
		width: '35%',
		component(label: string, { canMoveDown, canMoveUp, id, name, path }) {
			return (
				<>
					<div className="u-flex u-flex-align-center u-flex-no-wrap">
						<ButtonGroup direction="vertical">
							<Button
								onClick={() => moveRow(id, MoveAction.UP)}
								icon="chevron-up"
								ariaLabel="Move item up"
								type="primary"
								htmlType="button"
								size="tiny"
								transparent
								disabled={!canMoveUp}
								negative
							/>
							<Button
								onClick={() => moveRow(id, MoveAction.DOWN)}
								icon="chevron-down"
								ariaLabel="Move item down"
								type="primary"
								htmlType="button"
								size="tiny"
								disabled={!canMoveDown}
								transparent
								negative
							/>
						</ButtonGroup>
						<div className="u-margin-left-xs u-min-w-0">
							{path ? (
								<Link to={path}>{renderEllipsisWithTooltip(label)}</Link>
							) : (
								<p className="u-text-bold">{renderEllipsisWithTooltip(label)}</p>
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
		width: '15%',
		ellipsis: true,
		disableSorting: true,
	},
	{
		label: 'Meerdere',
		value: 'multiple',
		disableSorting: true,
		width: '10%',
		classList: ['u-text-center'],
		component(multiple: boolean | undefined) {
			return !isNil(multiple) ? <StatusIcon active={multiple ?? false} /> : null;
		},
	},
	{
		label: 'Verplicht',
		value: 'required',
		width: '10%',
		classList: ['u-text-center'],
		disableSorting: true,
		component(required: boolean | undefined) {
			return !isNil(required) ? <StatusIcon active={required ?? false} /> : null;
		},
	},
	{
		label: 'Vertaalbaar',
		value: 'translatable',
		width: '10%',
		disableSorting: true,
		classList: ['u-text-center'],
		component(translatable: boolean | undefined) {
			return !isNil(translatable) ? <StatusIcon active={translatable ?? false} /> : null;
		},
	},
	{
		label: 'Verborgen',
		value: 'hidden',
		width: '10%',
		disableSorting: true,
		classList: ['u-text-center'],
		component(hidden: boolean | undefined) {
			return !isNil(hidden) ? <StatusIcon active={hidden ?? false} /> : null;
		},
	},
	{
		label: '',
		disableSorting: true,
		width: '10%',
		classList: ['is-condensed', 'u-text-right'],
		component(value, { id, navigate }: ContentTypeDetailCCRow) {
			return (
				<Button
					ariaLabel="Edit"
					icon="edit"
					onClick={() =>
						navigate && typeof navigate === 'function' ? navigate() : onExpand(id)
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
