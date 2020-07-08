import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	Container,
} from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import kebabCase from 'lodash.kebabcase';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';

import { NavList, RenderChildRoutes } from '../../components';
import { useCoreTranslation } from '../../connectors/translations';
import { MODULE_PATHS } from '../../contentTypes.const';
import { generateFieldFromType } from '../../contentTypes.helpers';
import { ContentTypesDetailRouteProps } from '../../contentTypes.types';
import { useFieldType, useNavigate, useQuery, useTenantContext } from '../../hooks';
import { ContentTypeFieldDetailModel, contentTypesFacade } from '../../store/contentTypes';
import { fieldTypesFacade } from '../../store/fieldTypes';

import { CC_NAV_LIST_ITEMS } from './ContentTypesCCNew.const';

const ContentTypesCCNew: FC<ContentTypesDetailRouteProps> = ({ match, state, route }) => {
	const { contentTypeUuid } = match.params;
	/**
	 * Hooks
	 */
	const [CTField, setCTField] = useState<ContentTypeFieldDetailModel | null>(null);
	const query = useQuery();
	const fieldTypeUuid = query.get('fieldType');
	const name = query.get('name');
	const [, fieldType] = useFieldType();
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
		if (fieldTypeUuid) {
			fieldTypesFacade.getFieldType(fieldTypeUuid);
		}
	}, [fieldTypeUuid]);

	useEffect(() => {
		if (fieldType) {
			const initialValues = { label: name || '', name: kebabCase(name || '') };
			contentTypesFacade.setActiveField(generateFieldFromType(fieldType, initialValues));
		}
	}, [fieldType, name]);

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
			contentTypesFacade.addField(CTField);
			navigateToOverview();
		}
	};

	const onFieldTypeChange = (data: ContentTypeFieldDetailModel): void => {
		setCTField({ ...CTField, ...data });
	};

	/**
	 * Render
	 */
	if (!CTField && !state.activeField) {
		return null;
	}

	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			CTField,
			fieldTypeData: CTField?.fieldType.data,
			preset: CTField?.config.preset,
			onSubmit: onFieldTypeChange,
		};

		return (
			<RenderChildRoutes
				routes={route.routes}
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
