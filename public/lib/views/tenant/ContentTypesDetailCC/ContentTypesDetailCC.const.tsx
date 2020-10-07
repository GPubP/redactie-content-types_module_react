import { TranslateFunc } from '@redactie/translations-module';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import React from 'react';
import { Link } from 'react-router-dom';
import { array, object, string } from 'yup';

import { StatusIcon } from '../../../components';
import { MODULE_PATHS, TENANT_ROOT } from '../../../contentTypes.const';

import { ContentTypeDetailCCRow } from './ContentTypesDetailCC.types';

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
		disableSorting: true,
		component(value: string, rowData: ContentTypeDetailCCRow) {
			const { path } = rowData;
			return (
				<>
					<Link to={path}>{value}</Link>
					<p className="u-text-light">systeemnaam: [{rowData.name}]</p>
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
		component(value: any, rowData: ContentTypeDetailCCRow) {
			return <StatusIcon active={rowData.multiple} />;
		},
	},
	{
		label: 'Verplicht',
		value: 'required',
		disableSorting: true,
		component(value: any, rowData: ContentTypeDetailCCRow) {
			return <StatusIcon active={rowData.required} />;
		},
	},
	{
		label: 'Vertaalbaar',
		value: 'translatable',
		disableSorting: true,
		component(value: any, rowData: ContentTypeDetailCCRow) {
			return <StatusIcon active={rowData.translatable} />;
		},
	},
	{
		label: 'Verborgen',
		value: 'hidden',
		disableSorting: true,
		component(value: any, rowData: ContentTypeDetailCCRow) {
			return <StatusIcon active={rowData.hidden} />;
		},
	},
];

export const CT_DETAIL_CC_ALLOWED_PATHS = [`${TENANT_ROOT}${MODULE_PATHS.detailCCEdit}`];
