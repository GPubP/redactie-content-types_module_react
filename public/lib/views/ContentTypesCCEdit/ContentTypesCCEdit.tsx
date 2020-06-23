import { Button, Card } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	Container,
} from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';

import { DataLoader, NavList, RenderChildRoutes } from '../../components';
import { useCoreTranslation } from '../../connectors/translations';
import { MODULE_PATHS } from '../../contentTypes.const';
import { ContentTypesDetailRouteProps } from '../../contentTypes.types';
import { useFieldType, useNavigate, useTenantContext } from '../../hooks';
import { ContentTypeField, internalService } from '../../store/internal';

import { CC_NAV_LIST_ITEMS } from './ContentTypesCCEdit.const';

const ContentTypesCCEdit: FC<ContentTypesDetailRouteProps> = ({ match, routes, state }) => {
	const { contentTypeUuid } = match.params;
	const { activeField, fields } = state;

	/**
	 * Hooks
	 */
	const [updatedField, setUpdatedField] = useState<ContentTypeField | null>(null);
	const [loadingState, fieldType] = useFieldType(activeField?.fieldType.uuid);
	const { generatePath, navigate } = useNavigate();
	const { tenantId } = useTenantContext();
	const [t] = useCoreTranslation();
	const guardsMeta = useMemo(
		() => ({
			tenantId,
		}),
		[tenantId]
	);

	useEffect(() => {
		if (activeField && fieldType) {
			setUpdatedField(activeField);
		}
	}, [activeField, fieldType]);

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		navigate(MODULE_PATHS.detailCC, { contentTypeUuid });
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

		const extraOptions = {
			CTField: updatedField,
			fieldTypeData: fieldType,
			routes: activeRoute?.routes,
			onDelete: onFieldDelete,
			onSubmit: onFieldChange,
		};

		return (
			<RenderChildRoutes
				routes={activeRoute?.routes}
				guardsMeta={guardsMeta}
				extraOptions={extraOptions}
			/>
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
									to: generatePath(listItem.to, { contentTypeUuid }),
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
							{t(CORE_TRANSLATIONS.BUTTON_SAVE)}
						</Button>
						<Button onClick={navigateToOverview} outline>
							{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
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
