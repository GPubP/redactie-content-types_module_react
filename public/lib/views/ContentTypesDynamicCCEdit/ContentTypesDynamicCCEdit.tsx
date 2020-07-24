import { Button, Card, CardBody } from '@acpaas-ui/react-components';
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
import { ContentTypesDetailRouteProps, LoadingState } from '../../contentTypes.types';
import { useNavigate, useTenantContext } from '../../hooks';
import useActiveField from '../../hooks/useActiveField/useActiveField';
import useDynamicActiveField from '../../hooks/useDynamicActiveField/useDynamicActiveField';
import { ContentTypeFieldDetailModel, contentTypesFacade } from '../../store/contentTypes';
import { dynamicFieldFacade } from '../../store/dynamicField/dynamicField.facade';

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
	const dynamicActiveField = useDynamicActiveField();
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
		if (activeField) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [activeField]);

	useEffect(() => {
		if (!contentComponentUuid || !Array.isArray(contentType.fields)) {
			return;
		}

		const activeField = contentType.fields.find(field => field.uuid === contentComponentUuid);

		if (activeField) {
			contentTypesFacade.setActiveField(activeField);
		}
	}, [contentComponentUuid, contentType, contentType.fields]);

	useEffect(() => {
		if (!dynamicContentComponentUuid || !Array.isArray(activeField?.config?.fields)) {
			return;
		}

		const field = (activeField?.config?.fields || []).find(
			f => f.uuid === dynamicContentComponentUuid
		);

		if (!field) {
			return;
		}

		if (activeField) {
			dynamicFieldFacade.setActiveField(field);
		}
	}, [dynamicContentComponentUuid, activeField]);

	// TODO: find out if this is still necessary in this context
	// useEffect(() => {
	// 	if (activeFieldFTUuid) {
	// 		fieldTypesFacade.getFieldType(activeFieldFTUuid);
	// 	} else {
	// 		fieldTypesFacade.clearFieldType();
	// 	}

	// 	if (activeFieldPSUuid) {
	// 		presetsFacade.getPreset(activeFieldPSUuid);
	// 	} else {
	// 		presetsFacade.clearPreset();
	// 	}
	// }, []);

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
		dynamicFieldFacade.updateField(data);
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
		dynamicFieldFacade.updateField(dynamicActiveField);
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
									meta: dynamicActiveField?.fieldType,
									to: generatePath(listItem.to, {
										contentTypeUuid,
										contentComponentUuid,
										dynamicContentComponentUuid,
									}),
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
								onClick={onFieldSubmit}
								type="success"
							>
								{t(CORE_TRANSLATIONS.BUTTON_SAVE)}
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
