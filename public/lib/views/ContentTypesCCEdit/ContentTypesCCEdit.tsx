import { Button, Card } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	Container,
} from '@acpaas-ui/react-editorial-components';
import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { DataLoader, NavList } from '../../components';
import { MODULE_PATHS } from '../../contentTypes.const';
import { ContentTypesCCRouteProps, ContentTypesDetailRouteProps } from '../../contentTypes.types';
import { useFieldType, useNavigate, useTenantContext } from '../../hooks';
import { ContentTypeField, internalService } from '../../store/internal';

import { CC_NAV_LIST_ITEMS } from './ContentTypesCCEdit.const';

const ContentTypesCCEdit: FC<ContentTypesDetailRouteProps> = ({ contentType, routes, state }) => {
	const { activeField, fields } = state;

	/**
	 * Hooks
	 */
	const [updatedField, setUpdatedField] = useState<ContentTypeField | null>(null);
	const [loadingState, fieldType] = useFieldType(activeField?.fieldType.uuid);
	const { generatePath, navigate } = useNavigate();
	const { tenantId } = useTenantContext();

	useEffect(() => {
		if (activeField && fieldType) {
			setUpdatedField(activeField);
		}
	}, [activeField, fieldType]);

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		navigate(MODULE_PATHS.detailCC, { contentTypeUuid: contentType.uuid });
	};

	const onFieldChange = (data: ContentTypeField): void => {
		setUpdatedField({
			...updatedField,
			...data,
			config: {
				...updatedField?.config,
				...data.config,
			},
		});
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
				fieldTypeData: fieldType,
				routes: activeRoute?.routes,
				onDelete: onFieldDelete,
				onSubmit: onFieldChange,
			} as ContentTypesCCRouteProps
		);
	};

	const renderCCEdit = (): ReactElement | null => {
		if (!fieldType) {
			return null;
		}

		return (
			<>
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
						<Button
							className="u-margin-right-xs"
							onClick={onFieldSubmit}
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
		<Container>
			<DataLoader loadingState={loadingState} render={renderCCEdit} />
		</Container>
	);
};

export default ContentTypesCCEdit;
