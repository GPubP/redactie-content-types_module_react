import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	Container,
} from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Redirect } from 'react-router-dom';

import { NavList, RenderChildRoutes } from '../../components';
import { useCoreTranslation } from '../../connectors/translations';
import { MODULE_PATHS } from '../../contentTypes.const';
import { ContentTypesDetailRouteProps } from '../../contentTypes.types';
import { useNavigate, useTenantContext } from '../../hooks';
import { ContentTypeField, internalService } from '../../store/internal';

import { CC_NAV_LIST_ITEMS } from './ContentTypesCCNew.const';

const ContentTypesCCNew: FC<ContentTypesDetailRouteProps> = ({ match, routes, state }) => {
	const { contentTypeUuid } = match.params;
	/**
	 * Hooks
	 */
	const [CTField, setCTField] = useState<ContentTypeField | null>(null);
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
		if (state.activeField) {
			setCTField(state.activeField);
		}
	}, [state.activeField]);

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		navigate(MODULE_PATHS.detailCC, { contentTypeUuid });
	};

	const onCTSubmit = (): void => {
		if (CTField) {
			internalService.updateFields([...state.fields, CTField]);
			navigateToOverview();
		}
	};

	const onFieldTypeChange = (data: ContentTypeField): void => {
		setCTField({ ...CTField, ...data });
	};

	/**
	 * Render
	 */
	if (!CTField && !state.activeField) {
		return <Redirect to={generatePath(MODULE_PATHS.detailCC, { contentTypeUuid })} />;
	}

	const renderChildRoutes = (): ReactElement | null => {
		const activeRoute =
			routes.find(item => item.path === `/${tenantId}${MODULE_PATHS.detailCCNew}`) || null;

		const extraOptions = {
			CTField,
			fieldTypeData: CTField?.fieldType.data,
			routes: activeRoute?.routes,
			onSubmit: onFieldTypeChange,
		};

		return (
			<RenderChildRoutes
				routes={activeRoute?.routes}
				guardsMeta={guardsMeta}
				extraOptions={extraOptions}
			/>
		);
	};

	return (
		<>
			<Container>
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
								<CardBody>{renderChildRoutes()}</CardBody>
							</Card>
						</div>
					</div>
				</div>
				<ActionBar className="o-action-bar--fixed" isOpen>
					<ActionBarContentSection>
						<div className="u-wrapper row end-xs">
							<Button onClick={navigateToOverview} negative>
								{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
							</Button>
							<Button
								className="u-margin-left-xs"
								onClick={onCTSubmit}
								type="success"
							>
								{t(CORE_TRANSLATIONS.BUTTON_SAVE)}
							</Button>
						</div>
					</ActionBarContentSection>
				</ActionBar>
			</Container>
		</>
	);
};

export default ContentTypesCCNew;
