import { Button, Card } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	Container,
} from '@acpaas-ui/react-editorial-components';
import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { NavList } from '../../components';
import { MODULE_PATHS } from '../../contentTypes.const';
import { generateFieldFromType, parseContentTypeField } from '../../contentTypes.helpers';
import { ContentTypesCCRouteProps, ContentTypesDetailRouteProps } from '../../contentTypes.types';
import { useNavigate, useTenantContext } from '../../hooks';
import { ContentTypeFieldSchema } from '../../services/contentTypes';
import { internalService } from '../../store/internal';

import { CC_NAV_LIST_ITEMS } from './ContentTypesCCEdit.const';

const ContentTypesCCEdit: FC<ContentTypesDetailRouteProps> = ({ contentType, routes, state }) => {
	const { activeField, fields } = state;

	/**
	 * Hooks
	 */
	const [updatedField, setUpdatedField] = useState<ContentTypeFieldSchema | null>(null);
	const { generatePath, navigate } = useNavigate();
	const { tenantId } = useTenantContext();

	useEffect(() => {
		if (activeField) {
			const initialValues = parseContentTypeField(activeField);
			setUpdatedField(generateFieldFromType(activeField.fieldType.data, initialValues));
		}
	}, [activeField]);

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		navigate(MODULE_PATHS.detailCC, { contentTypeUuid: contentType.uuid });
	};

	const onFieldChange = (data: ContentTypeFieldSchema): void => {
		setUpdatedField({ ...updatedField, ...data });
	};

	const onFieldDelete = (): void => {
		internalService.updateFields(fields.filter(field => field.uuid !== activeField?.uuid));
		navigateToOverview();
	};

	const onFieldSubmit = (): void => {
		if (updatedField) {
			internalService.updateFields(
				fields.map(field => (field.uuid === activeField?.uuid ? updatedField : field))
			);
			navigateToOverview();
		}
	};

	/**
	 * Render
	 */
	const renderChildRoutes = (): ReactElement | null => {
		if (!activeField || !updatedField) {
			return null;
		}

		const activeRoute =
			routes.find(item => item.path === `/${tenantId}${MODULE_PATHS.detailCCEdit}`) || null;

		return Core.routes.render(
			activeRoute?.routes as ModuleRouteConfig[],
			{
				contentType,
				CTField: updatedField,
				fieldTypeData: activeField.fieldType.data,
				routes: activeRoute?.routes,
				onDelete: onFieldDelete,
				onSubmit: onFieldChange,
			} as ContentTypesCCRouteProps
		);
	};

	return (
		<Container>
			<div className="u-margin-bottom-lg">
				<div className="row between-xs top-xs">
					<div className="col-xs-3">
						<NavList
							items={CC_NAV_LIST_ITEMS.map(listItem => ({
								...listItem,
								to: generatePath(listItem.to, {
									contentTypeUuid: contentType.uuid,
								}),
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
					<Button className="u-margin-right-xs" onClick={onFieldSubmit} type="success">
						Bewaar
					</Button>
					<Button onClick={navigateToOverview} outline>
						Annuleer
					</Button>
				</ActionBarContentSection>
			</ActionBar>
		</Container>
	);
};

export default ContentTypesCCEdit;
