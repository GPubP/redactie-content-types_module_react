import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection, NavList } from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { alertService, LeavePrompt, useDetectValueChanges } from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import kebabCase from 'lodash.kebabcase';
import { equals, isEmpty, omit } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { DataLoader, RenderChildRoutes } from '../../../components';
import { useCoreTranslation } from '../../../connectors/translations';
import { ALERT_CONTAINER_IDS, MODULE_PATHS } from '../../../contentTypes.const';
import { ContentTypesDetailRouteProps, LoadingState } from '../../../contentTypes.types';
import { filterCompartments, generateFieldFromType, validateCompartments } from '../../../helpers';
import {
	useCompartments,
	useCompartmentValidation,
	useFieldType,
	useNavigate,
	useNavItemMatcher,
	usePreset,
	useQuery,
	useTenantContext,
} from '../../../hooks';
import useActiveField from '../../../hooks/useActiveField/useActiveField';
import useDynamicActiveField from '../../../hooks/useDynamicActiveField/useDynamicActiveField';
import useDynamicField from '../../../hooks/useDynamicField/useDynamicField';
import { ContentTypeFieldDetailModel } from '../../../store/contentTypes';
import { dynamicFieldFacade } from '../../../store/dynamicField/dynamicField.facade';
import { fieldTypesFacade } from '../../../store/fieldTypes';
import { presetsFacade } from '../../../store/presets';
import { compartmentsFacade } from '../../../store/ui/compartments';

import {
	DYNAMIC_CC_NEW_ALLOWED_PATHS,
	DYNAMIC_CC_NEW_COMPARTMENTS,
} from './ContentTypesDynamicCCNew.const';

const ContentTypesDynamicCCNew: FC<ContentTypesDetailRouteProps> = ({
	contentType,
	location,
	match,
	route,
}) => {
	const { contentTypeUuid, contentComponentUuid } = match.params;

	/**
	 * Hooks
	 */
	const [hasSubmit, setHasSubmit] = useState(false);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const activeCompartmentFormikRef = useRef<FormikProps<FormikValues>>();
	const { fieldType: fieldTypeUuid, preset: presetUuid } = useQuery();
	const [fieldTypeLoadingState, fieldType] = useFieldType();
	const [presetLoadingState, preset] = usePreset();
	const activeField = useActiveField();
	const dynamicField = useDynamicField();
	const dynamicActiveField = useDynamicActiveField();
	const { generatePath, navigate } = useNavigate();
	const { tenantId } = useTenantContext();
	const [t] = useCoreTranslation();
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);
	const navItemMatcher = useNavItemMatcher(preset, fieldType);
	const [hasChanges] = useDetectValueChanges(
		initialLoading === LoadingState.Loaded,
		dynamicActiveField
	);
	const [
		{ compartments, active: activeCompartment },
		register,
		activate,
		validate,
	] = useCompartments();
	const navListItems = compartments.map(c => ({
		activeClassName: 'is-active',
		label: c.label,
		hasError: hasSubmit && c.isValid === false,
		onClick: () => activate(c.name),
		to: generatePath(`${c.slug || c.name}${location.search}`, {
			contentTypeUuid,
			contentComponentUuid,
		}),
	}));

	/**
	 * Trigger errors on form when switching from compartments
	 */
	useCompartmentValidation(activeCompartmentFormikRef, activeCompartment, hasSubmit);

	/**
	 * Set compartments
	 */
	useEffect(() => {
		if (!fieldType) {
			return;
		}
		register(filterCompartments(DYNAMIC_CC_NEW_COMPARTMENTS, navItemMatcher), {
			replace: true,
		});

		return () => {
			compartmentsFacade.clearCompartments();
		};
	}, [fieldType, navItemMatcher]); // eslint-disable-line

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
	 * Clear store on component destroy
	 */
	useEffect(
		() => () => {
			dynamicFieldFacade.clearActiveField();
			presetsFacade.clearPreset();
			fieldTypesFacade.clearFieldType();
		},
		[]
	);

	/**
	 * Methods
	 */
	const navigateToDetail = (): void => {
		navigate(
			activeField?.__new ? MODULE_PATHS.detailCCNewConfig : MODULE_PATHS.detailCCEditConfig,
			{
				contentTypeUuid,
				contentComponentUuid,
			},
			{
				// This will keep the current active field (paragraaf) in state when we redirect.
				// Changes made to the configuration of this field will not be overwritten
				keepActiveField: true,
			},
			new URLSearchParams(
				activeField?.__new
					? {
							fieldType: activeField?.fieldType.uuid,
							name: activeField.label,
					  }
					: {}
			)
		);
	};

	const onFieldSubmit = (): void => {
		if (!dynamicActiveField) {
			return;
		}

		const { current: formikRef } = activeCompartmentFormikRef;
		const compartmentsAreValid = validateCompartments(
			compartments,
			dynamicActiveField,
			validate
		);

		// Validate current form to trigger fields error states
		if (formikRef) {
			formikRef.validateForm().then(errors => {
				if (!isEmpty(errors)) {
					formikRef.setErrors(errors);
				}
			});
		}
		// Only submit the form if all compartments are valid
		if (compartmentsAreValid) {
			dynamicFieldFacade.addField(omit(['__new'])(dynamicActiveField));
			navigateToDetail();
		} else {
			alertService.dismiss();
			alertService.danger(
				{
					title: 'Er zijn nog fouten',
					message: 'Lorem ipsum',
				},
				{ containerId: ALERT_CONTAINER_IDS.update }
			);
		}

		setHasSubmit(true);
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
			formikRef: (instance: any) => {
				if (!equals(activeCompartmentFormikRef.current, instance)) {
					activeCompartmentFormikRef.current = instance;
				}
			},
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
							<NavList items={navListItems} linkComponent={NavLink} />
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
				<LeavePrompt
					allowedPaths={DYNAMIC_CC_NEW_ALLOWED_PATHS}
					onConfirm={onFieldSubmit}
					shouldBlockNavigationOnConfirm
					when={hasChanges}
				/>
			</>
		);
	};

	return <DataLoader loadingState={initialLoading} render={renderCCNew} />;
};

export default ContentTypesDynamicCCNew;