import { Button } from '@acpaas-ui/react-components';
import { TranslateFunc } from '@redactie/translations-module';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { isNil } from 'ramda';
import React from 'react';
import { Link } from 'react-router-dom';

import { StatusIcon } from '../../../components';
import { MODULE_PATHS, TENANT_ROOT } from '../../../contentTypes.const';

import { ContentTypeDetailCCRow } from './ContentTypesDetailCC.types';

export const CONTENT_TYPE_COLUMNS = (
	t: TranslateFunc,
	onExpand: (id: string) => void = () => null,
	moveRowUp: (uuid: string) => void = () => null,
	moveRowDown: (uuid: string) => void = () => null
): any[] => [
	{
		label: '  ',
		disableSorting: true,
		component(value: any, rowData: ContentTypeDetailCCRow) {
			return (
				<div className="m-button-group m-button-group--vertical">
					<Button
						onClick={() => moveRowUp(rowData.id)}
						icon="chevron-up"
						ariaLabel="Move item up"
						type="primary"
						htmlType="button"
						size="tiny"
						transparent
						disabled={false}
						negative
					/>
					<Button
						onClick={() => moveRowDown(rowData.id)}
						icon="chevron-down"
						ariaLabel="Move item down"
						type="primary"
						htmlType="button"
						size="tiny"
						disabled={false}
						transparent
						negative
					/>
				</div>
			);
		},
	},
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'label',
		disableSorting: true,
		component(value: string, rowData: ContentTypeDetailCCRow) {
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
		component(value: any, rowData: ContentTypeDetailCCRow) {
			return !isNil(rowData.multiple) ? (
				<StatusIcon active={rowData.multiple ?? false} />
			) : null;
		},
	},
	{
		label: 'Verplicht',
		value: 'required',
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
		component(value: any, rowData: ContentTypeDetailCCRow) {
			return !isNil(rowData.hidden) ? <StatusIcon active={rowData.hidden ?? false} /> : null;
		},
	},
	{
		label: '',
		disableSorting: true,
		component(value: any, rowData: ContentTypeDetailCCRow) {
			return isNil(rowData.name) ? (
				<Button
					ariaLabel="Edit"
					icon="edit"
					onClick={() => onExpand(rowData.id)}
					type="primary"
					transparent
				></Button>
			) : null;
		},
	},
];

export const CT_DETAIL_CC_ALLOWED_PATHS = [
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEdit}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCNew}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCNewSettings}`,
];
