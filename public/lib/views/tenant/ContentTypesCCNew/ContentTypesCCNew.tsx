import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection, NavList } from '@acpaas-ui/react-editorial-components';
import {
	AlertContainer,
	alertService,
	DataLoader,
	LeavePrompt,
	LoadingState,
	RenderChildRoutes,
	useDetectValueChangesWorker,
	useNavigate,
	useTenantContext,
	useWillUnmount,
} from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import kebabCase from 'lodash.kebabcase';
import { equals, isEmpty } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import languagesConnector from '../../../connectors/languages';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';
import { ALERT_CONTAINER_IDS, MODULE_PATHS } from '../../../contentTypes.const';
import { ContentTypesDetailRouteProps } from '../../../contentTypes.types';
import { generateFieldFromType, validateCompartments } from '../../../helpers';
import {
	useActiveField,
	useActiveFieldType,
	useActivePreset,
	useCompartments,
	useCompartmentValidation,
	useDynamicField,
	useNavItemMatcher,
	useQuery,
} from '../../../hooks';
import { FieldType } from '../../../services/fieldTypes';
import { Preset } from '../../../services/presets';
import { ContentTypeFieldDetailModel, contentTypesFacade } from '../../../store/contentTypes';
import { dynamicFieldFacade } from '../../../store/dynamicField/dynamicField.facade';
import { fieldTypesFacade } from '../../../store/fieldTypes';
import { presetsFacade } from '../../../store/presets';
import { compartmentsFacade } from '../../../store/ui/compartments';

import { CC_NEW_ALLOWED_PATHS, CC_NEW_COMPARTMENTS } from './ContentTypesCCNew.const';

const ContentTypesCCNew: FC<ContentTypesDetailRouteProps> = ({ match, route }) => {
	const { contentTypeUuid, ctType } = match.params;

	/**
	 * Hooks
	 */
	const [hasSubmit, setHasSubmit] = useState(false);
	const location = useLocation<{ keepActiveField: boolean }>();
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [compartmentsInitialized, setCompartmentsInitialized] = useState(false);
	const [compartmentsInitialValidated, setCompartmentsInitialValidated] = useState(false);
	const activeCompartmentFormikRef = useRef<FormikProps<FormikValues>>();
	const activeField = useActiveField();
	const dynamicField = useDynamicField();
	const {
		fieldType: fieldTypeUuid,
		preset: presetUuid,
		name,
		compartment: fieldCompartment,
	} = useQuery();
	const [preset, presetUI] = useActivePreset(presetUuid);
	const [fieldType, fieldTypeUI] = useActiveFieldType(
		presetUuid ? preset?.data.fieldType.uuid : fieldTypeUuid
	);
	const { generatePath, navigate } = useNavigate();
	const { tenantId } = useTenantContext();
	const [t] = useCoreTranslation();
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);
	const navItemMatcher = useNavItemMatcher(preset, fieldType);
	const [isSubmitting, setIsSubmiting] = useState<boolean>(false);
	const [hasChanges] = useDetectValueChangesWorker(
		initialLoading === LoadingState.Loaded,
		activeField,
		BFF_MODULE_PUBLIC_PATH
	);
	const locationState = location.state ?? {
		keepActiveField: false,
	};
	const [
		{ compartments, visibleCompartments, active: activeCompartment },
		register,
		activate,
		validate,
		setVisibility,
	] = useCompartments();
	const [, languages] = languagesConnector.hooks.useActiveLanguages();
	const navListItems = visibleCompartments.map(c => ({
		activeClassName: 'is-active',
		label: c.label,
		hasError: hasSubmit && c.isValid === false,
		onClick: () => activate(c.name),
		to: {
			pathname: generatePath(`${c.slug || c.name}`, {
				ctType,
				contentTypeUuid,
			}),
			search: location.search,
			state: { keepActiveField: !!locationState?.keepActiveField },
		},
	}));

	/**
	 * Clear store on component destroy
	 */
	useWillUnmount(() => {
		fieldTypesFacade.removeActiveFieldType();
		presetsFacade.removeActivePreset();
	});

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

		register(CC_NEW_COMPARTMENTS, { replace: true }, navItemMatcher);

		if (!compartmentsInitialized && navItemMatcher) {
			setCompartmentsInitialized(true);
		}

		return () => {
			compartmentsFacade.clearCompartments();
		};
	}, [fieldType, navItemMatcher]); // eslint-disable-line

	useEffect(() => {
		if (!fieldTypeUI?.isFetching && !presetUI?.isFetching && activeField) {
			return setInitialLoading(LoadingState.Loaded);
		}
	}, [activeField, fieldTypeUI, presetUI]);

	useEffect(() => {
		if (
			!compartmentsInitialValidated &&
			compartmentsInitialized &&
			compartments &&
			visibleCompartments &&
			activeField &&
			navItemMatcher &&
			fieldType &&
			(!presetUuid || preset)
		) {
			// Initial run validation
			validateCompartments(
				compartments,
				activeField,
				validate,
				setVisibility,
				navItemMatcher,
				fieldType as FieldType,
				(preset as unknown) as Preset,
				languages || []
			);
			setCompartmentsInitialValidated(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		activeField,
		visibleCompartments,
		compartments,
		compartmentsInitialized,
		fieldType,
		navItemMatcher,
		preset,
		presetUuid,
	]);

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
		if (
			isSubmitting === false &&
			fieldType?.data?.generalConfig &&
			!locationState.keepActiveField
		) {
			const initialValues = {
				label: name || fieldType.data.generalConfig.defaultLabel || '',
				name: kebabCase(name || ''),
				generalConfig: {
					guideline: fieldType.data.generalConfig.defaultGuideline || '',
					multiLanguage:
						preset?.data.generalConfig.defaultTranslateValue ||
						fieldType.data.generalConfig.defaultTranslateValue ||
						false,
				},
			};
			const generatedActiveField = generateFieldFromType(
				fieldType,
				initialValues,
				fieldCompartment,
				preset || undefined
			);
			contentTypesFacade.setActiveField(generatedActiveField);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fieldType, name, preset, fieldCompartment, locationState.keepActiveField]);

	const navigateToDetail = (): void => {
		navigate(MODULE_PATHS.detailCC, { ctType, contentTypeUuid });
	};

	useEffect(() => {
		isSubmitting && navigateToDetail();
	}, [isSubmitting]); // eslint-disable-line

	/**
	 * Methods
	 */
	const onCTSubmit = (): void => {
		if (!activeField) {
			return;
		}

		const { current: formikRef } = activeCompartmentFormikRef;
		const compartmentsAreValid = validateCompartments(
			compartments,
			activeField,
			validate,
			setVisibility,
			navItemMatcher,
			fieldType as FieldType,
			(preset as unknown) as Preset,
			languages || []
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
			setIsSubmiting(true);
			contentTypesFacade.addField(activeField);
			contentTypesFacade.clearActiveField();
		} else {
			alertService.invalidForm({
				containerId: ALERT_CONTAINER_IDS.configureCC,
			});
		}

		setHasSubmit(true);
	};

	const onFieldTypeChange = (data: ContentTypeFieldDetailModel): void => {
		validateCompartments(
			compartments,
			{
				...activeField,
				...data,
			},
			validate,
			setVisibility,
			navItemMatcher,
			fieldType as FieldType,
			(preset as unknown) as Preset,
			languages || []
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
			dynamicFieldSettingsContext: {
				dynamicField,
				getCreatePath: (isPreset: boolean, fieldTypeUuid: string) =>
					generatePath(
						MODULE_PATHS.detailCCEditDynamicNewSettings,
						{
							ctType,
							contentTypeUuid,
							contentComponentUuid: activeField?.uuid,
						},
						new URLSearchParams(
							isPreset ? { preset: fieldTypeUuid } : { fieldType: fieldTypeUuid }
						)
					),
				getEditPath: (uuid: string) =>
					generatePath(MODULE_PATHS.detailCCEditDynamicEditSettings, {
						ctType,
						contentTypeUuid,
						contentComponentUuid: activeField?.uuid,
						dynamicContentComponentUuid: uuid,
					}),
				setDynamicField: dynamicFieldFacade.setDynamicField.bind(dynamicFieldFacade),
			},
			onSubmit: onFieldTypeChange,
			formikRef: (instance: FormikProps<FormikValues>) => {
				if (!equals(activeCompartmentFormikRef.current, instance)) {
					activeCompartmentFormikRef.current = instance;
				}
			},
			activeLanguages: languages || [],
			hasSubmit,
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
		if (!fieldType || !activeField) {
			return <DataLoader loadingState={LoadingState.Loading} render={() => null} />;
		}

		return (
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
							<Button
								className="u-margin-left-xs"
								onClick={onCTSubmit}
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
		<>
			<AlertContainer
				toastClassName="u-margin-bottom"
				containerId={ALERT_CONTAINER_IDS.configureCC}
			/>
			<DataLoader loadingState={initialLoading} render={renderCCNew} />
			<LeavePrompt
				allowedPaths={CC_NEW_ALLOWED_PATHS}
				onConfirm={onCTSubmit}
				shouldBlockNavigationOnConfirm
				when={hasChanges && !isSubmitting}
			/>
		</>
	);
};

export default ContentTypesCCNew;
