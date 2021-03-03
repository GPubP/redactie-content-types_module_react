import { EllipsisWithTooltip } from '@acpaas-ui/react-editorial-components';
import { TranslateFunc } from '@redactie/translations-module';
import { TableColumn } from '@redactie/utils';
import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { CORE_TRANSLATIONS } from '../../../connectors/translations';
import StatusIcon from '../../StatusIcon/StatusIcon';

import { DynamicFieldCCRow } from './DynamicFieldSettings.types';

const renderEllipsisWithTooltip = (value: string): ReactElement => (
	<EllipsisWithTooltip>{value}</EllipsisWithTooltip>
);

export const DYNAMIC_CC_COLUMNS = (t: TranslateFunc): TableColumn<DynamicFieldCCRow>[] => [
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'label',
		disableSorting: true,
		width: '30%',
		component(label: string, { name, path }) {
			return (
				<>
					{path ? (
						<Link to={path}>{renderEllipsisWithTooltip(label)}</Link>
					) : (
						<p>{renderEllipsisWithTooltip(label)}</p>
					)}
					{name && (
						<p className="u-text-light">
							{renderEllipsisWithTooltip(`systeemnaam: [${name}]`)}
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
		width: '20%',
		disableSorting: true,
	},
	{
		label: 'Meerdere',
		value: 'multiple',
		disableSorting: true,
		width: '12.5%',
		classList: ['u-text-center'],
		component(multiple: boolean | undefined) {
			return <StatusIcon active={multiple ?? false} />;
		},
	},
	{
		label: 'Verplicht',
		value: 'required',
		disableSorting: true,
		width: '12.5%',
		classList: ['u-text-center'],
		component(required: boolean | undefined) {
			return <StatusIcon active={required ?? false} />;
		},
	},
	{
		label: 'Vertaalbaar',
		value: 'translatable',
		disableSorting: true,
		width: '12.5%',
		classList: ['u-text-center'],
		component(translatable: boolean | undefined) {
			return <StatusIcon active={translatable ?? false} />;
		},
	},
	{
		label: 'Verborgen',
		value: 'hidden',
		disableSorting: true,
		width: '12.5%',
		classList: ['u-text-center'],
		component(hidden: boolean | undefined) {
			return <StatusIcon active={hidden ?? false} />;
		},
	},
];
