import { Link } from '@acpaas-ui/react-components';
import React from 'react';
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

export const CONTENT_TYPE_COLUMNS = [
	{
		label: 'Naam',
		value: 'label',
		component(value: string, rowData: ContentTypeDetailCCRow) {
			const { navigate } = rowData;
			return (
				<>
					<Link onClick={navigate}>{value}</Link>
					<p className="u-text-light">systeemnaam: [{rowData.name}]</p>
				</>
			);
		},
	},
	{
		label: 'Type',
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
