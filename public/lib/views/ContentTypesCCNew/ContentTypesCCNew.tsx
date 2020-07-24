import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	Container,
} from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import kebabCase from 'lodash.kebabcase';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';

import { DataLoader, NavList, RenderChildRoutes } from '../../components';
import { useCoreTranslation } from '../../connectors/translations';
import { MODULE_PATHS } from '../../contentTypes.const';
import { ContentTypesDetailRouteProps, LoadingState } from '../../contentTypes.types';
import { generateFieldFromType } from '../../helpers';
import { useFieldType, useNavigate, usePreset, useQuery, useTenantContext } from '../../hooks';
import { ContentTypeFieldDetailModel, contentTypesFacade } from '../../store/contentTypes';
import { fieldTypesFacade } from '../../store/fieldTypes';
import { presetsFacade } from '../../store/presets';

import { CC_NAV_LIST_ITEMS } from './ContentTypesCCNew.const';

const ContentTypesCCNew: FC<ContentTypesDetailRouteProps> = ({
	match,
	activeField,
	route,
	history,
}) => {
	const { contentTypeUuid } = match.params;
	/**
	 * Hooks
	 */
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const query = useQuery();
	const fieldTypeUuid = query.get('fieldType');
	const presetUuid = query.get('preset');
	const name = query.get('name');
	const [fieldTypeLoadingState, fieldType] = useFieldType();
	const [presetLoadingState, preset] = usePreset();
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
			fieldTypeLoadingState !== LoadingState.Loading &&
			presetLoadingState !== LoadingState.Loading
		) {
			return setInitialLoading(LoadingState.Loaded);
		}
	}, [presetLoadingState, fieldTypeLoadingState]);

	/**
	 * Get preset or fieldType based on the input of the
	 * query parameters
	 */
	useEffect(() => {
		if (!presetUuid && fieldTypeUuid) {
			fieldTypesFacade.getFieldType(fieldTypeUuid);
		}

		if (!fieldTypeUuid && presetUuid) {
			presetsFacade.getPreset(presetUuid);
		}
	}, [fieldTypeUuid, presetUuid]);

	/**
	 * Get the fieldType from a preset when it exists
	 */
	useEffect(() => {
		if (preset) {
			fieldTypesFacade.getFieldType(preset.data.fieldType.uuid);
		}
	}, [preset]);

	/**
	 * Generate a new field based on the selected fieldtype and
	 * make it the active working field in the store
	 */
	useEffect(() => {
		if (fieldType) {
			const initialValues = { label: name || '', name: kebabCase(name || '') };
			contentTypesFacade.setActiveField(
				generateFieldFromType(fieldType, initialValues, preset || undefined)
			);
		}
	}, [fieldType, name, preset]);

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		navigate(MODULE_PATHS.detailCC, { contentTypeUuid });
	};

	const onCTSubmit = (): void => {
		if (activeField) {
			contentTypesFacade.addField(activeField);
			navigateToOverview();
		}
	};

	const onFieldTypeChange = (data: ContentTypeFieldDetailModel): void => {
		contentTypesFacade.updateActiveField(data);
	};

	/**
	 * Render
	 */
	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			CTField: activeField,
			fieldTypeData: activeField?.fieldType.data,
			preset: preset,
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

	const renderCCNew = (): ReactElement | null => (
		<>
			<div className="u-margin-bottom-lg">
				<div className="row between-xs top-xs">
					<div className="col-xs-3">
						<NavList
							items={CC_NAV_LIST_ITEMS.map(listItem => ({
								...listItem,
								meta: preset || fieldType,
								to: generatePath(`${listItem.to}${history.location.search}`, {
									contentTypeUuid,
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
						<Button className="u-margin-left-xs" onClick={onCTSubmit} type="success">
							{t(CORE_TRANSLATIONS.BUTTON_SAVE)}
						</Button>
					</div>
				</ActionBarContentSection>
			</ActionBar>
		</>
	);

	return (
		<Container>
			<DataLoader loadingState={initialLoading} render={renderCCNew} />
		</Container>
	);
};

export default ContentTypesCCNew;
