import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	Container,
	NavList,
} from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { omit } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { DataLoader, RenderChildRoutes } from '../../components';
import { useCoreTranslation } from '../../connectors/translations';
import { MODULE_PATHS } from '../../contentTypes.const';
import { ContentTypesDetailRouteProps, LoadingState } from '../../contentTypes.types';
import { useNavigate, useNavItemMatcher, useTenantContext } from '../../hooks';
import useActiveField from '../../hooks/useActiveField/useActiveField';
import useDynamicActiveField from '../../hooks/useDynamicActiveField/useDynamicActiveField';
import useDynamicField from '../../hooks/useDynamicField/useDynamicField';
import { PresetDetail } from '../../services/presets';
import { ContentTypeFieldDetailModel, contentTypesFacade } from '../../store/contentTypes';
import { dynamicFieldFacade } from '../../store/dynamicField/dynamicField.facade';
import { fieldTypesFacade } from '../../store/fieldTypes';
import { presetsFacade } from '../../store/presets';

import { CC_DYNAMIC_NAV_LIST_ITEMS } from './ContentTypesDynamicCCEdit.const';

const ContentTypesDynamicCCEdit: FC<ContentTypesDetailRouteProps<{
	contentTypeUuid: string;
	contentComponentUuid: string;
	dynamicContentComponentUuid: string;
}>> = ({ match, contentType, route }) => {
	const { contentTypeUuid, contentComponentUuid, dynamicContentComponentUuid } = match.params;

	/**
	 * Hooks
	 */
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const activeField = useActiveField();
	const dynamicField = useDynamicField();
	const dynamicActiveField = useDynamicActiveField();
	const { generatePath, navigate } = useNavigate();
	const { tenantId } = useTenantContext();
	const [t] = useCoreTranslation();
	const activeFieldFTUuid = useMemo(() => activeField?.fieldType.uuid, [activeField]);
	const activeFieldPSUuid = useMemo(() => activeField?.preset?.uuid, [activeField]);
	const guardsMeta = useMemo(
		() => ({
			tenantId,
		}),
		[tenantId]
	);
	const navItemMatcher = useNavItemMatcher(
		dynamicActiveField?.preset as PresetDetail,
		dynamicActiveField?.fieldType
	);

	useEffect(() => {
		if (activeField) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [activeField]);

	useEffect(() => {
		if (
			!contentComponentUuid ||
			!Array.isArray(contentType.fields) ||
			(activeField && activeField.uuid === contentComponentUuid)
		) {
			return;
		}

		const newActiveField = contentType.fields.find(
			field => field.uuid === contentComponentUuid
		);

		if (newActiveField) {
			contentTypesFacade.setActiveField(newActiveField);
		}
	}, [activeField, contentComponentUuid, contentType, contentType.fields]);

	useEffect(() => {
		if (
			!dynamicContentComponentUuid ||
			!Array.isArray(dynamicField?.config?.fields) ||
			dynamicActiveField?.uuid === dynamicContentComponentUuid ||
			!dynamicField
		) {
			return;
		}

		const field = (dynamicField?.config?.fields || []).find(
			f => f.uuid === dynamicContentComponentUuid
		);

		if (!field) {
			return;
		}

		dynamicFieldFacade.setActiveField(field);
	}, [dynamicContentComponentUuid, activeField, dynamicActiveField, dynamicField]);

	useEffect(() => {
		if (activeFieldFTUuid) {
			fieldTypesFacade.getFieldType(activeFieldFTUuid);
		} else {
			fieldTypesFacade.clearFieldType();
		}

		if (activeFieldPSUuid) {
			presetsFacade.getPreset(activeFieldPSUuid);
		} else {
			presetsFacade.clearPreset();
		}
	}, [activeFieldFTUuid, activeFieldPSUuid]);

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		navigate(
			activeField?.__new ? MODULE_PATHS.detailCCNewConfig : MODULE_PATHS.detailCCEditConfig,
			{
				contentTypeUuid,
				contentComponentUuid,
				...(activeField?.__new ? { fieldType: activeField?.fieldType.uuid } : {}),
			}
		);
	};

	const onFieldChange = (data: ContentTypeFieldDetailModel): void => {
		dynamicFieldFacade.updateActiveField({
			...data,
		});
	};

	const onFieldDelete = (): void => {
		if (!dynamicActiveField?.uuid) {
			return;
		}

		dynamicFieldFacade.deleteField(dynamicActiveField.uuid);
		dynamicFieldFacade.clearActiveField();
		navigateToOverview();
	};

	const onFieldSubmit = (): void => {
		if (!dynamicActiveField) {
			return;
		}

		dynamicFieldFacade.updateField(omit(['__new'])(dynamicActiveField));
		navigateToOverview();
	};

	/**
	 * Render
	 */
	const renderChildRoutes = (): ReactElement | void => {
		if (!dynamicActiveField) {
			return;
		}

		const extraOptions = {
			CTField: dynamicActiveField,
			fieldTypeData: dynamicActiveField?.fieldType?.data,
			preset: dynamicActiveField?.preset,
			onDelete: onFieldDelete,
			onSubmit: onFieldChange,
		};

		return (
			<RenderChildRoutes
				routes={route.routes}
				guardsMeta={guardsMeta}
				extraOptions={extraOptions}
			/>
		);
	};

	const renderCCEdit = (): ReactElement | null => {
		return (
			<>
				<div className="u-margin-bottom-lg">
					<div className="row between-xs top-xs">
						<div className="col-xs-3">
							<NavList
								items={CC_DYNAMIC_NAV_LIST_ITEMS.map(listItem => ({
									...listItem,
									meta: navItemMatcher,
									to: generatePath(listItem.to, {
										contentTypeUuid,
										contentComponentUuid,
										dynamicContentComponentUuid,
									}),
								}))}
								linkComponent={NavLink}
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
								onClick={onFieldSubmit}
								type="primary"
							>
								{t(CORE_TRANSLATIONS.BUTTON_NEXT)}
							</Button>
						</div>
					</ActionBarContentSection>
				</ActionBar>
			</>
		);
	};

	return (
		<Container>
			<DataLoader loadingState={initialLoading} render={renderCCEdit} />
		</Container>
	);
};

export default ContentTypesDynamicCCEdit;
