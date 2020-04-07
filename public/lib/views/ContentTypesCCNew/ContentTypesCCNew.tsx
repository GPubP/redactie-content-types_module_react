import { Button, Card } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import kebabCase from 'lodash.kebabcase';
import { parse } from 'query-string';
import { equals } from 'ramda';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { DataLoader, NavList } from '../../components';
import { CONTENT_TYPE_DETAIL_TAB_MAP, MODULE_PATHS } from '../../contentTypes.const';
import { useFieldType, useNavigate, useTenantContext } from '../../hooks';
import { FieldTypeSchemaData } from '../../services/fieldTypes';

import { CC_NAV_LIST_ITEMS } from './ContentTypesCCNew.const';
import { ContentTypesCCNewProps } from './ContentTypesCCNew.types';

const ContentTypesCCNew: FC<ContentTypesCCNewProps> = ({
	contentType,
	location,
	routes,
	onSubmit,
}) => {
	const { fieldType: fieldTypeUuid, name } = parse(location.search);
	const initalFieldValues = {
		name: kebabCase((name as string | undefined) || ''),
		label: (name as string | undefined) || '',
	};

	/**
	 * Hooks
	 */
	const [newFieldType, setNewFieldType] = useState<FieldTypeSchemaData | null>(null);
	const [loadingState, fieldType] = useFieldType(
		fieldTypeUuid as string | undefined,
		initalFieldValues
	);
	const { generatePath, navigate } = useNavigate();
	const { tenantId } = useTenantContext();

	useEffect(() => {
		if (fieldType && !newFieldType) {
			setNewFieldType(fieldType);
		}
	}, [fieldType, newFieldType]);

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		navigate(MODULE_PATHS.detailCC, { contentTypeUuid: contentType.uuid });
	};

	const onCTSubmit = (): void => {
		onSubmit(newFieldType, CONTENT_TYPE_DETAIL_TAB_MAP.contentComponents);
		navigateToOverview();
	};

	const onFieldTypeChange = (data: Partial<FieldTypeSchemaData>): void => {
		setNewFieldType({ ...fieldType, ...data } as FieldTypeSchemaData);
	};

	/**
	 * Render
	 */
	const renderChildRoutes = (): any => {
		const activeRoute =
			routes.find(item => item.path === `/${tenantId}${MODULE_PATHS.detailCCNew}`) || null;

		const fieldTypeData = {
			...fieldType,
			label: (name as string | undefined) || '',
			name: kebabCase((name as string | undefined) || ''),
		} as FieldTypeSchemaData;

		return Core.routes.render(activeRoute?.routes as ModuleRouteConfig[], {
			fieldTypeData,
			routes: activeRoute?.routes,
			onSubmit: onFieldTypeChange,
		});
	};

	const renderCCNew = (): ReactElement => {
		return (
			<>
				<div className="u-margin-bottom-lg">
					<div className="row between-xs top-xs">
						<div className="col-xs-3">
							<NavList
								items={CC_NAV_LIST_ITEMS.map(listItem => ({
									...listItem,
									to: generatePath(
										`${listItem.to}?fieldType=:fieldType&name=:name`,
										{
											contentTypeUuid: contentType.uuid,
											fieldType: fieldTypeUuid as string,
											name: name as string,
										}
									),
								}))}
							/>
						</div>

						<div className="col-xs-9">
							<Card>
								<div className="u-margin">{renderChildRoutes()}</div>
							</Card>
						</div>
					</div>
				</div>
				<ActionBar isOpen>
					<ActionBarContentSection>
						<Button
							className="u-margin-right-xs"
							disabled={equals(fieldType, newFieldType) || !newFieldType}
							onClick={onCTSubmit}
							type="success"
						>
							Bewaar
						</Button>
						<Button onClick={navigateToOverview} outline>
							Annuleer
						</Button>
					</ActionBarContentSection>
				</ActionBar>
			</>
		);
	};

	return (
		<>
			<div className="u-container u-wrapper u-margin-top u-margin-bottom">
				<DataLoader loadingState={loadingState} render={renderCCNew} />
			</div>
		</>
	);
};

export default ContentTypesCCNew;
