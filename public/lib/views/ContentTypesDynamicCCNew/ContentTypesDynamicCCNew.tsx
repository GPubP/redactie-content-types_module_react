import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	Container,
} from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { LeavePrompt, useDetectValueChanges } from '@redactie/utils';
import kebabCase from 'lodash.kebabcase';
import { omit } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';

import { DataLoader, NavList, RenderChildRoutes } from '../../components';
import { useCoreTranslation } from '../../connectors/translations';
import { MODULE_PATHS } from '../../contentTypes.const';
import { ContentTypesDetailRouteProps, LoadingState } from '../../contentTypes.types';
import { generateFieldFromType } from '../../helpers';
import {
	useFieldType,
	useNavigate,
	useNavItemMatcher,
	usePreset,
	useQuery,
	useTenantContext,
} from '../../hooks';
import useActiveField from '../../hooks/useActiveField/useActiveField';
import useDynamicActiveField from '../../hooks/useDynamicActiveField/useDynamicActiveField';
import useDynamicField from '../../hooks/useDynamicField/useDynamicField';
import { ContentTypeFieldDetailModel } from '../../store/contentTypes';
import { dynamicFieldFacade } from '../../store/dynamicField/dynamicField.facade';
import { fieldTypesFacade } from '../../store/fieldTypes';
import { presetsFacade } from '../../store/presets';

import { CC_NAV_LIST_ITEMS } from './ContentTypesDynamicCCNew.const';

const ContentTypesDynamicCCNew: FC<ContentTypesDetailRouteProps> = ({
	match,
	contentType,
	route,
}) => {
	const { contentTypeUuid, contentComponentUuid } = match.params;

	/**
	 * Hooks
	 */
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const query = useQuery();
	const fieldTypeUuid = query.get('fieldType');
	const presetUuid = query.get('preset');
	const [fieldTypeLoadingState, fieldType] = useFieldType();
	const [presetLoadingState, preset] = usePreset();
	const activeField = useActiveField();
	const dynamicField = useDynamicField();
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
	const navItemMatcher = useNavItemMatcher(preset, fieldType);
	const [hasChanges] = useDetectValueChanges(!initialLoading, dynamicActiveField);

	useEffect(() => {
		dynamicFieldFacade.clearActiveField();
		presetsFacade.clearPreset();
		fieldTypesFacade.clearFieldType();
	}, []);

	useEffect(() => {
		if (
			fieldTypeLoadingState !== LoadingState.Loading &&
			presetLoadingState !== LoadingState.Loading &&
			dynamicField
		) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [dynamicField, fieldTypeLoadingState, presetLoadingState]);

	useEffect(() => {
		if (
			dynamicField || // Only set dynamic field if it hasn't been set yet (in case of reload)
			!contentComponentUuid || // Incufficient data => skip
			!Array.isArray(contentType.fields) // Insufficient data => skip
		) {
			return;
		}

		if (activeField) {
			dynamicFieldFacade.setDynamicField(activeField);
		}

		const newActiveField = contentType.fields.find(
			field => field.uuid === contentComponentUuid
		);

		if (newActiveField) {
			dynamicFieldFacade.setDynamicField(newActiveField);
		}
	}, [activeField, contentComponentUuid, contentType.fields, dynamicField]);

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
			const initialValues = {
				label: fieldType.data.label,
				name: kebabCase(fieldType.data.name || ''),
			};
			dynamicFieldFacade.setActiveField(
				generateFieldFromType(fieldType, initialValues, preset || undefined)
			);
		}
	}, [fieldType, preset]);

	/**
	 * Methods
	 */
	const navigateToDetail = (): void => {
		navigate(
			activeField?.__new ? MODULE_PATHS.detailCCNewConfig : MODULE_PATHS.detailCCEditConfig,
			{
				contentTypeUuid,
				contentComponentUuid,
				...(activeField?.__new ? { fieldType: activeField?.fieldType.uuid } : {}),
			}
		);
	};

	const onFieldSubmit = (cancelNavigation = false): void => {
		if (!dynamicActiveField) {
			return;
		}

		dynamicFieldFacade.addField(omit(['__new'])(dynamicActiveField));

		if (cancelNavigation) {
			navigateToDetail();
		}
	};

	const onFieldTypeChange = (data: ContentTypeFieldDetailModel): void => {
		dynamicFieldFacade.updateActiveField(data);
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

	const renderCCNew = (): ReactElement | null => {
		return (
			<>
				<div className="u-margin-bottom-lg">
					<div className="row between-xs top-xs">
						<div className="col-xs-3">
							<NavList
								items={CC_NAV_LIST_ITEMS.map(listItem => ({
									...listItem,
									meta: navItemMatcher,
									to: generatePath(
										listItem.to,
										{
											contentTypeUuid,
											contentComponentUuid,
										},
										query
									),
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
							<Button onClick={navigateToDetail} negative>
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
				<LeavePrompt when={hasChanges} onConfirm={() => onFieldSubmit()} />
			</>
		);
	};

	return (
		<Container>
			<DataLoader loadingState={initialLoading} render={renderCCNew} />
		</Container>
	);
};

export default ContentTypesDynamicCCNew;
