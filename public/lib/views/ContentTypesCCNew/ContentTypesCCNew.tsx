import { Button, Card } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import kebabCase from 'lodash.kebabcase';
import { parse } from 'query-string';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { DataLoader, NavList } from '../../components';
import { MODULE_PATHS } from '../../contentTypes.const';
import { generateFieldFromType } from '../../contentTypes.helpers';
import {
	ContentTypesCCNewRouteProps,
	ContentTypesDetailRouteProps,
} from '../../contentTypes.types';
import { useFieldType, useNavigate, useTenantContext } from '../../hooks';
import { ContentTypeFieldSchema } from '../../services/contentTypes';

import { CC_NAV_LIST_ITEMS } from './ContentTypesCCNew.const';

const ContentTypesCCNew: FC<ContentTypesDetailRouteProps> = ({
	contentType,
	CTFields,
	setCTFields,
	location,
	routes,
}) => {
	const { fieldType: fieldTypeUuid, id: fieldTypeId, name } = parse(location.search);
	const initalFieldValues = {
		name: kebabCase((name as string | undefined) || ''),
		label: (name as string | undefined) || '',
		fieldType: fieldTypeId as string | undefined,
	};

	/**
	 * Hooks
	 */
	const [CTField, setCTField] = useState<ContentTypeFieldSchema | null>(null);
	const [loadingState, fieldType] = useFieldType(fieldTypeUuid as string | undefined);
	const { generatePath, navigate } = useNavigate();
	const { tenantId } = useTenantContext();

	useEffect(() => {
		if (fieldType && !CTField) {
			setCTField(generateFieldFromType(fieldType, initalFieldValues));
		}
	}, [fieldType, CTField, initalFieldValues]);

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		navigate(MODULE_PATHS.detailCC, { contentTypeUuid: contentType.uuid });
	};

	const onCTSubmit = (): void => {
		if (CTField) {
			setCTFields([...CTFields, CTField]);
			navigateToOverview();
		}
	};

	const onFieldTypeChange = (data: ContentTypeFieldSchema): void => {
		setCTField({ ...CTField, ...data });
	};

	/**
	 * Render
	 */
	const renderChildRoutes = (): ReactElement | null => {
		const activeRoute =
			routes.find(item => item.path === `/${tenantId}${MODULE_PATHS.detailCCNew}`) || null;

		return Core.routes.render(
			activeRoute?.routes as ModuleRouteConfig[],
			{
				CTField,
				fieldTypeData: fieldType,
				routes: activeRoute?.routes,
				onSubmit: onFieldTypeChange,
			} as ContentTypesCCNewRouteProps
		);
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
				<ActionBar className="o-action-bar--fixed" isOpen>
					<ActionBarContentSection>
						<Button className="u-margin-right-xs" onClick={onCTSubmit} type="success">
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
