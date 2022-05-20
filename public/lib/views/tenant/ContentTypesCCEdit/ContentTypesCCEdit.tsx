import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection, NavList } from '@acpaas-ui/react-editorial-components';
import {
	AlertContainer,
	alertService,
	DataLoader,
	DeletePrompt,
	LeavePrompt,
	LoadingState,
	RenderChildRoutes,
	useDetectValueChangesWorker,
	useNavigate,
	useTenantContext,
	useWillUnmount,
} from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import { equals, isEmpty } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import languagesConnector from '../../../connectors/languages';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';
import { ALERT_CONTAINER_IDS, MODULE_PATHS } from '../../../contentTypes.const';
import { ContentTypesDetailRouteProps } from '../../../contentTypes.types';
import { validateCompartments } from '../../../helpers';
import {
	useActiveField,
	useActiveFieldType,
	useActivePreset,
	useCompartments,
	useCompartmentValidation,
	useDynamicField,
	useNavItemMatcher,
} from '../../../hooks';
import { FieldType } from '../../../services/fieldTypes';
import { Preset } from '../../../services/presets';
import { ContentTypeFieldDetailModel, contentTypesFacade } from '../../../store/contentTypes';
import { dynamicFieldFacade } from '../../../store/dynamicField/dynamicField.facade';
import { fieldTypesFacade } from '../../../store/fieldTypes';
import { presetsFacade } from '../../../store/presets';
import { compartmentsFacade } from '../../../store/ui/compartments';

import { CC_EDIT_ALLOWED_PATHS, CC_EDIT_COMPARTMENTS } from './ContentTypesCCEdit.const';

const ContentTypesCCEdit: FC<ContentTypesDetailRouteProps> = ({ match, contentType, route }) => {
	const { contentTypeUuid, contentComponentUuid, ctType } = match.params;

	/**
	 * Hooks
	 */
	const [hasSubmit, setHasSubmit] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [invalidCCUuid, setInvalidCCUuid] = useState(false);
	const activeCompartmentFormikRef = useRef<FormikProps<FormikValues>>();
	const activeField = useActiveField();
	const dynamicField = useDynamicField();
	const { generatePath, navigate } = useNavigate();
	const { tenantId } = useTenantContext();
	const [t] = useCoreTranslation();
	const activeFieldFTUuid = useMemo(() => activeField?.fieldType.uuid, [activeField]);
	const activeFieldPSUuid = useMemo(() => activeField?.preset?.uuid, [activeField]);
	const [fieldType, fieldTypeUI] = useActiveFieldType(activeFieldFTUuid);
	const [preset, presetUI] = useActivePreset(activeFieldPSUuid);
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);
	const navItemMatcher = useNavItemMatcher(preset, fieldType);
	const [isSubmitting, setIsSubmiting] = useState<boolean>(false);
	const [hasChanges] = useDetectValueChangesWorker(
		initialLoading === LoadingState.Loaded,
		activeField,
		BFF_MODULE_PUBLIC_PATH
	);
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
		to: generatePath(c.slug || c.name, { contentTypeUuid, contentComponentUuid, ctType }),
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

		register(CC_EDIT_COMPARTMENTS, { replace: true }, navItemMatcher);

		return () => {
			compartmentsFacade.clearCompartments();
		};
	}, [fieldType, navItemMatcher]); // eslint-disable-line

	useEffect(() => {
		if (!fieldTypeUI?.isFetching && !presetUI?.isFetching && fieldType) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [fieldType, fieldTypeUI, presetUI]);

	useEffect(() => {
		if (
			isSubmitting === true ||
			!contentComponentUuid ||
			!Array.isArray(contentType.fields) ||
			(activeField && activeField?.uuid === contentComponentUuid)
		) {
			return;
		}

		const newActiveField = contentType.fields.find(
			field => field.uuid === contentComponentUuid
		);

		if (newActiveField) {
			contentTypesFacade.setActiveField(newActiveField);
		} else {
			setInvalidCCUuid(true);
		}
	}, [activeField, activeFieldFTUuid, contentComponentUuid, contentType.fields, isSubmitting]);

	const navigateToDetail = (): void => {
		navigate(MODULE_PATHS.detailCC, { ctType, contentTypeUuid });
	};

	useEffect(() => {
		isSubmitting && navigateToDetail();
	}, [isSubmitting]); // eslint-disable-line

	/**
	 * Methods
	 */

	const onFieldChange = (data: ContentTypeFieldDetailModel): void => {
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

	const onFieldDelete = (): void => {
		setShowDeleteModal(true);
	};

	const onDeletePromptConfirm = (): void => {
		if (activeField?.uuid) {
			contentTypesFacade.deleteField(activeField.uuid);
			contentTypesFacade.clearActiveField();
			navigateToDetail();
		}
	};

	const onDeletePromptCancel = (): void => {
		setShowDeleteModal(false);
	};

	const onLeavePromptDelete = (): void => {
		if (activeField?.uuid) {
			contentTypesFacade.clearActiveField();
		}
	};

	const onFieldSubmit = (): void => {
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
			contentTypesFacade.updateField(activeField);
			contentTypesFacade.clearActiveField();
		} else {
			alertService.invalidForm({
				containerId: ALERT_CONTAINER_IDS.configureCC,
			});
		}

		setHasSubmit(true);
	};

	/**
	 * Render
	 */
	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			CTField: activeField,
			fieldType: fieldType,
			preset,
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
			onDelete: onFieldDelete,
			onSubmit: onFieldChange,
			formikRef: (instance: FormikProps<FormikValues>) => {
				if (!equals(activeCompartmentFormikRef.current, instance)) {
					activeCompartmentFormikRef.current = instance;
				}
			},
			contentType,
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

	const renderCCEdit = (): ReactElement | null => {
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
		<>
			<AlertContainer
				toastClassName="u-margin-bottom"
				containerId={ALERT_CONTAINER_IDS.configureCC}
			/>
			{!invalidCCUuid ? (
				<DataLoader loadingState={initialLoading} render={renderCCEdit} />
			) : (
				<div>
					<p className="u-margin-top-xs u-margin-bottom">
						De content component kan niet worden geladen. Probeer later opnieuw.
					</p>
					<Button onClick={navigateToDetail} outline>
						{t(CORE_TRANSLATIONS['BUTTON_BACK-TO-OVERVIEW'])}
					</Button>
				</div>
			)}
			<LeavePrompt
				allowedPaths={CC_EDIT_ALLOWED_PATHS}
				onDelete={onLeavePromptDelete}
				onConfirm={onFieldSubmit}
				shouldBlockNavigationOnConfirm
				when={hasChanges && !isSubmitting}
			/>
			<DeletePrompt
				show={showDeleteModal}
				onCancel={onDeletePromptCancel}
				onConfirm={onDeletePromptConfirm}
			/>
		</>
	);
};

export default ContentTypesCCEdit;
