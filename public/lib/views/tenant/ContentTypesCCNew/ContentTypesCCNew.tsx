import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection, NavList } from '@acpaas-ui/react-editorial-components';
import {
	alertService,
	LeavePrompt,
	useDetectValueChangesWorker,
	useTenantContext,
} from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import kebabCase from 'lodash.kebabcase';
import { equals, isEmpty } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { DataLoader, RenderChildRoutes } from '../../../components';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';
import { ALERT_CONTAINER_IDS, MODULE_PATHS } from '../../../contentTypes.const';
import { ContentTypesDetailRouteProps, LoadingState } from '../../../contentTypes.types';
import { filterCompartments, generateFieldFromType, validateCompartments } from '../../../helpers';
import {
	useActiveField,
	useCompartments,
	useCompartmentValidation,
	useFieldType,
	useNavigate,
	useNavItemMatcher,
	usePreset,
	useQuery,
} from '../../../hooks';
import { FieldType } from '../../../services/fieldTypes';
import { Preset } from '../../../services/presets';
import { ContentTypeFieldDetailModel, contentTypesFacade } from '../../../store/contentTypes';
import { fieldTypesFacade } from '../../../store/fieldTypes';
import { presetsFacade } from '../../../store/presets';
import { compartmentsFacade } from '../../../store/ui/compartments';

import { CC_NEW_ALLOWED_PATHS, CC_NEW_COMPARTMENTS } from './ContentTypesCCNew.const';

const ContentTypesCCNew: FC<ContentTypesDetailRouteProps> = ({ match, route }) => {
	const { contentTypeUuid } = match.params;

	/**
	 * Hooks
	 */
	const [hasSubmit, setHasSubmit] = useState(false);
	const location = useLocation<{ keepActiveField: boolean }>();
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const activeCompartmentFormikRef = useRef<FormikProps<FormikValues>>();
	const activeField = useActiveField();
	const {
		fieldType: fieldTypeUuid,
		preset: presetUuid,
		name,
		compartment: fieldCompartment,
	} = useQuery();
	const [fieldTypeLoadingState, fieldType] = useFieldType();
	const [presetLoadingState, preset] = usePreset();
	const { generatePath, navigate } = useNavigate();
	const { tenantId } = useTenantContext();
	const [t] = useCoreTranslation();
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);
	const navItemMatcher = useNavItemMatcher(preset, fieldType);
	const [hasChanges] = useDetectValueChangesWorker(
		initialLoading === LoadingState.Loaded,
		activeField,
		BFF_MODULE_PUBLIC_PATH
	);
	const locationState = location.state ?? {
		keepActiveField: false,
	};
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
		to: {
			pathname: generatePath(`${c.slug || c.name}`, {
				contentTypeUuid,
			}),
			search: location.search,
			state: { keepActiveField: !!locationState?.keepActiveField },
		},
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

		register(filterCompartments(CC_NEW_COMPARTMENTS, navItemMatcher), { replace: true });

		return () => {
			compartmentsFacade.clearCompartments();
		};
	}, [fieldType, navItemMatcher]); // eslint-disable-line

	useEffect(() => {
		if (
			fieldTypeLoadingState !== LoadingState.Loading &&
			presetLoadingState !== LoadingState.Loading &&
			activeField
		) {
			return setInitialLoading(LoadingState.Loaded);
		}
	}, [presetLoadingState, fieldTypeLoadingState, activeField]);

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
		if (
			!locationState.keepActiveField &&
			((!fieldType && !preset) ||
				(fieldType && fieldTypeUuid !== fieldType.uuid) ||
				(preset && presetUuid !== preset.uuid))
		) {
			contentTypesFacade.clearActiveField();
		}

		// Keep the current active field when keepActiveField is set to true
		// This happens when the user navigates from the ContentTypesDynamicCCNew to the
		// ContentTypesCCNew view
		// We can not generate a new field because when we do, all changes on the current active
		// field will be lost
		if (fieldType?.data?.generalConfig && !locationState.keepActiveField) {
			const initialValues = {
				label: name || fieldType.data.generalConfig.defaultLabel || '',
				name: kebabCase(name || ''),
				generalConfig: { guideline: fieldType.data.generalConfig.defaultGuideline || '' },
			};
			contentTypesFacade.setActiveField(
				generateFieldFromType(
					fieldType,
					initialValues,
					fieldCompartment,
					preset || undefined
				)
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fieldType, name, preset, fieldCompartment, locationState.keepActiveField]);

	/**
	 * Clear store on component destroy
	 */
	useEffect(
		() => () => {
			presetsFacade.clearPreset();
			fieldTypesFacade.clearFieldType();
		},
		[]
	);

	/**
	 * Methods
	 */
	const navigateToDetail = (): void => {
		navigate(MODULE_PATHS.detailCC, { contentTypeUuid });
	};

	const onCTSubmit = (): void => {
		if (!activeField) {
			return;
		}

		const { current: formikRef } = activeCompartmentFormikRef;
		const compartmentsAreValid = validateCompartments(
			compartments,
			activeField,
			validate,
			fieldType as FieldType,
			(preset as unknown) as Preset
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
			contentTypesFacade.addField(activeField);
			contentTypesFacade.clearActiveField();
			navigateToDetail();
		} else {
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
		validateCompartments(
			compartments,
			data,
			validate,
			fieldType as FieldType,
			(preset as unknown) as Preset
		);
		contentTypesFacade.updateActiveField(data);
	};

	/**
	 * Render
	 */

	// Can't create a new CC if the fieldTypeUuid or presetUuid and name are unknown
	if (!(fieldTypeUuid || presetUuid) || !name) {
		navigateToDetail();
	}

	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			CTField: activeField,
			fieldType: activeField?.fieldType,
			preset: preset,
			onSubmit: onFieldTypeChange,
			formikRef: (instance: FormikProps<FormikValues>) => {
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

	const renderCCNew = (): ReactElement | null => (
		<>
			<div className="u-margin-bottom-lg">
				<div className="row between-xs top-xs">
					<div className="col-xs-12 col-md-3 u-margin-bottom">
						<NavList items={navListItems} linkComponent={NavLink} />
					</div>

					<div className="col-xs-12 col-md-9">
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
						<Button className="u-margin-left-xs" onClick={onCTSubmit} type="success">
							{t(CORE_TRANSLATIONS.BUTTON_SAVE)}
						</Button>
					</div>
				</ActionBarContentSection>
			</ActionBar>
			<LeavePrompt
				allowedPaths={CC_NEW_ALLOWED_PATHS}
				onConfirm={onCTSubmit}
				shouldBlockNavigationOnConfirm
				when={hasChanges}
			/>
		</>
	);

	return <DataLoader loadingState={initialLoading} render={renderCCNew} />;
};

export default ContentTypesCCNew;
