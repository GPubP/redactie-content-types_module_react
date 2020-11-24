import { TranslateFunc } from '@redactie/translations-module';
import React from 'react';
import { Link } from 'react-router-dom';

import { CORE_TRANSLATIONS } from '../../../connectors/translations';
import StatusIcon from '../../StatusIcon/StatusIcon';

import { DynamicFieldCCRow } from './DynamicFieldSettings.types';

export const DYNAMIC_CC_COLUMNS = (t: TranslateFunc): any[] => [
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'label',
		disableSorting: true,
		component(value: string, rowData: DynamicFieldCCRow) {
			const { path } = rowData;
			return (
				<>
					{path ? <Link to={path}>{value}</Link> : <p>{value}</p>}
					{rowData.name && <p className="u-text-light">systeemnaam: [{rowData.name}]</p>}
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
		component(value: any, rowData: DynamicFieldCCRow) {
			return <StatusIcon active={rowData.multiple ?? false} />;
		},
	},
	{
		label: 'Verplicht',
		value: 'required',
		disableSorting: true,
		component(value: any, rowData: DynamicFieldCCRow) {
			return <StatusIcon active={rowData.required ?? false} />;
		},
	},
	{
		label: 'Vertaalbaar',
		value: 'translatable',
		disableSorting: true,
		component(value: any, rowData: DynamicFieldCCRow) {
			return <StatusIcon active={rowData.translatable ?? false} />;
		},
	},
	{
		label: 'Verborgen',
		value: 'hidden',
		disableSorting: true,
		component(value: any, rowData: DynamicFieldCCRow) {
			return <StatusIcon active={rowData.hidden ?? false} />;
		},
	},
];
