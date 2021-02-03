import { EllipsisWithTooltip, TooltipTypeMap } from '@acpaas-ui/react-editorial-components';
import { TranslateFunc } from '@redactie/translations-module';
import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { CORE_TRANSLATIONS } from '../../../connectors/translations';
import { TableColumn } from '../../../contentTypes.types';
import StatusIcon from '../../StatusIcon/StatusIcon';

import { DynamicFieldCCRow } from './DynamicFieldSettings.types';

const renderEllipsisWithTooltip = (value: string): ReactElement => (
	<EllipsisWithTooltip type={TooltipTypeMap.PRIMARY}>{value}</EllipsisWithTooltip>
);

export const DYNAMIC_CC_COLUMNS = (t: TranslateFunc): TableColumn<DynamicFieldCCRow>[] => [
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'label',
		disableSorting: true,
		component(value: string, rowData: DynamicFieldCCRow) {
			const { path } = rowData;
			return (
				<>
					{path ? (
						<Link to={path}>{renderEllipsisWithTooltip(value)}</Link>
					) : (
						<p>{renderEllipsisWithTooltip(value)}</p>
					)}
					{rowData.name && (
						<p className="u-text-light">
							{renderEllipsisWithTooltip(`systeemnaam: [${rowData.name}]`)}
						</p>
					)}
				</>
			);
		},
	},
	{
		label: t(CORE_TRANSLATIONS.TABLE_TYPE),
		value: 'fieldType',
		ellipsis: true,
		width: '150px',
		disableSorting: true,
	},
	{
		label: 'Meerdere',
		value: 'multiple',
		disableSorting: true,
		width: '100px',
		classList: ['u-text-center'],
		component(value: any, rowData: DynamicFieldCCRow) {
			return <StatusIcon active={rowData.multiple ?? false} />;
		},
	},
	{
		label: 'Verplicht',
		value: 'required',
		disableSorting: true,
		width: '100px',
		classList: ['u-text-center'],
		component(value: any, rowData: DynamicFieldCCRow) {
			return <StatusIcon active={rowData.required ?? false} />;
		},
	},
	{
		label: 'Vertaalbaar',
		value: 'translatable',
		disableSorting: true,
		width: '100px',
		classList: ['u-text-center'],
		component(value: any, rowData: DynamicFieldCCRow) {
			return <StatusIcon active={rowData.translatable ?? false} />;
		},
	},
	{
		label: 'Verborgen',
		value: 'hidden',
		disableSorting: true,
		width: '100px',
		classList: ['u-text-center'],
		component(value: any, rowData: DynamicFieldCCRow) {
			return <StatusIcon active={rowData.hidden ?? false} />;
		},
	},
];
