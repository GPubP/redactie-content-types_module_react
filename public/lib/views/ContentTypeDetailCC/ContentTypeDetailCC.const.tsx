import { TranslateFunc } from '@redactie/translations-module';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import React from 'react';
import { Link } from 'react-router-dom';
import { array, object, string } from 'yup';

import { StatusIcon } from '../../components';

import { ContentTypeDetailCCRow } from './ContentTypeDetailCC.types';

export const CT_CC_VALIDATION_SCHEMA = object().shape({
	fields: array(
		object().shape({
			uuid: string(),
			label: string().required(),
			name: string().required(),
			module: string()
				.required()
				.default('default'),
			dataType: string().required(),
			fieldType: string().required(),
			config: object().default({}),
			validators: array(string()),
		})
	),
});

export const CONTENT_TYPE_COLUMNS = (t: TranslateFunc): any[] => [
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'label',
		component(value: string, rowData: ContentTypeDetailCCRow) {
			const { path, setActiveField } = rowData;
			return (
				<>
					<Link to={path} onClick={() => setActiveField()}>
						{value}
					</Link>
					<p className="u-text-light">systeemnaam: [{rowData.name}]</p>
				</>
			);
		},
	},
	{
		label: CORE_TRANSLATIONS.TABLE_TYPE,
		value: 'fieldType',
	},
	{
		label: 'Meerdere',
		value: 'multiple',
		component(value: any, rowData: ContentTypeDetailCCRow) {
			return <StatusIcon active={rowData.multiple} />;
		},
	},
	{
		label: 'Verplicht',
		value: 'required',
		component(value: any, rowData: ContentTypeDetailCCRow) {
			return <StatusIcon active={rowData.required} />;
		},
	},
	{
		label: 'Vertaalbaar',
		value: 'translatable',
		component(value: any, rowData: ContentTypeDetailCCRow) {
			return <StatusIcon active={rowData.translatable} />;
		},
	},
	{
		label: 'Verborgen',
		value: 'hidden',
		component(value: any, rowData: ContentTypeDetailCCRow) {
			return <StatusIcon active={rowData.hidden} />;
		},
	},
];

export const CT_CC_NAV_LIST_ITEMS = [
	{ label: 'Compartiment 1', to: { hash: 'compartiment-1' } },
	{ label: 'Compartiment 2', to: { hash: 'compartiment-2' } },
	{ label: 'Compartiment 3', to: { hash: 'compartiment-3' } },
];
