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
import { useFieldType, useNavigate, useTenantContext, usePreset } from '../../hooks';
import { ContentTypeFieldDetailModel, contentTypesFacade } from '../../store/contentTypes';
import { fieldTypesFacade } from '../../store/fieldTypes';
import { presetsFacade } from '../../store/presets';

import { CC_NAV_LIST_ITEMS } from './ContentTypesCCEdit.const';

const ContentTypesCCEdit: FC<ContentTypesDetailRouteProps> = ({ match, state, route }) => {
	const { contentTypeUuid, contentComponentUuid } = match.params;
	const { activeField, fields } = state;

	/**
	 * Hooks
	 */
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [updatedField, setUpdatedField] = useState<ContentTypeFieldDetailModel | null>(null);
	const [fieldTypeLoading, fieldType] = useFieldType();
	const [presetLoading, preset] = usePreset();
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
		presetsFacade.clearPreset();
		fieldTypesFacade.clearFieldType();
	}, []);

	useEffect(() => {
		if (
			fieldTypeLoading !== LoadingState.Loading &&
			presetLoading !== LoadingState.Loading &&
			fieldType &&
			updatedField
		) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [fieldTypeLoading, fieldType, presetLoading, preset, updatedField]);

	useEffect(() => {
		if (contentComponentUuid && Array.isArray(fields)) {
			const activeField = fields.find(field => field.uuid === contentComponentUuid);
			if (activeField) {
				contentTypesFacade.setActiveField(activeField);
			}
		}
	}, [contentComponentUuid, fields]);

	useEffect(() => {
		if (activeField && fieldType) {
			setUpdatedField(activeField);
		}
	}, [activeField, fieldType]);

	useEffect(() => {
		if (activeField?.fieldType.uuid) {
			fieldTypesFacade.getFieldType(activeField.fieldType.uuid);
		}
		if (activeField?.preset?.uuid) {
			presetsFacade.getPreset(activeField.preset.uuid);
		}
	}, [activeField]);

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		navigate(MODULE_PATHS.detailCC, { contentTypeUuid });
	};

	const onFieldChange = (data: ContentTypeFieldDetailModel): void => {
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
		if (activeField?.uuid) {
			contentTypesFacade.deleteField(activeField.uuid);
			navigateToOverview();
		}
	};

	const onFieldSubmit = (): void => {
		if (updatedField) {
			contentTypesFacade.updateField(updatedField);
			navigateToOverview();
		}
	};

	/**
	 * Render
	 */
	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			CTField: updatedField,
			fieldTypeData: fieldType?.data,
			preset,
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
								items={CC_NAV_LIST_ITEMS.map(listItem => ({
									...listItem,
									to: generatePath(listItem.to, {
										contentTypeUuid,
										contentComponentUuid,
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

export default ContentTypesCCEdit;
