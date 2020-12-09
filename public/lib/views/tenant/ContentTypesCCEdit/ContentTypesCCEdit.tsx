import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection, NavList } from '@acpaas-ui/react-editorial-components';
import {
	alertService,
	DataLoader,
	LeavePrompt,
	LoadingState,
	RenderChildRoutes,
	useDetectValueChangesWorker,
	useNavigate,
	useTenantContext,
} from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import { equals, isEmpty } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';
import { ALERT_CONTAINER_IDS, MODULE_PATHS } from '../../../contentTypes.const';
import { ContentTypesDetailRouteProps } from '../../../contentTypes.types';
import { filterCompartments, validateCompartments } from '../../../helpers';
import {
	useActiveField,
	useActiveFieldType,
	useActivePreset,
	useCompartments,
	useCompartmentValidation,
	useNavItemMatcher,
} from '../../../hooks';
import { FieldType } from '../../../services/fieldTypes';
import { Preset } from '../../../services/presets';
import { ContentTypeFieldDetailModel, contentTypesFacade } from '../../../store/contentTypes';
import { compartmentsFacade } from '../../../store/ui/compartments';

import { CC_EDIT_ALLOWED_PATHS, CC_EDIT_COMPARTMENTS } from './ContentTypesCCEdit.const';

const ContentTypesCCEdit: FC<ContentTypesDetailRouteProps> = ({ match, contentType, route }) => {
	const { contentTypeUuid, contentComponentUuid } = match.params;

	/**
	 * Hooks
	 */
	const [hasSubmit, setHasSubmit] = useState(false);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [invalidCCUuid, setInvalidCCUuid] = useState(false);
	const activeCompartmentFormikRef = useRef<FormikProps<FormikValues>>();
	const activeField = useActiveField();
	const { generatePath, navigate } = useNavigate();
	const { tenantId } = useTenantContext();
	const [t] = useCoreTranslation();
	const activeFieldFTUuid = useMemo(() => activeField?.fieldType.uuid, [activeField]);
	const activeFieldPSUuid = useMemo(() => activeField?.preset?.uuid, [activeField]);
	const [fieldType, fieldTypeUI] = useActiveFieldType(activeFieldFTUuid);
	const [preset, presetUI] = useActivePreset(activeFieldPSUuid);
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);
	const navItemMatcher = useNavItemMatcher(preset, fieldType);
	const [hasChanges] = useDetectValueChangesWorker(
		initialLoading === LoadingState.Loaded,
		activeField,
		BFF_MODULE_PUBLIC_PATH
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
		to: generatePath(c.slug || c.name, { contentTypeUuid, contentComponentUuid }),
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

		register(filterCompartments(CC_EDIT_COMPARTMENTS, navItemMatcher), { replace: true });

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
	}, [activeField, activeFieldFTUuid, contentComponentUuid, contentType.fields]);

	/**
	 * Methods
	 */
	const navigateToDetail = (): void => {
		navigate(MODULE_PATHS.detailCC, { contentTypeUuid });
	};

	const onFieldChange = (data: ContentTypeFieldDetailModel): void => {
		validateCompartments(
			compartments,
			data,
			validate,
			fieldType as FieldType,
			(preset as unknown) as Preset
		);
		contentTypesFacade.updateActiveField(data);
	};

	const onFieldDelete = (): void => {
		if (activeField?.uuid) {
			contentTypesFacade.deleteField(activeField.uuid);
			contentTypesFacade.clearActiveField();
			navigateToDetail();
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
			contentTypesFacade.updateField(activeField);
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

	/**
	 * Render
	 */
	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			CTField: activeField,
			fieldType: fieldType,
			preset,
			onDelete: onFieldDelete,
			onSubmit: onFieldChange,
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

	const renderCCEdit = (): ReactElement | null => {
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
								type="success"
							>
								{t(CORE_TRANSLATIONS.BUTTON_SAVE)}
							</Button>
						</div>
					</ActionBarContentSection>
				</ActionBar>
				<LeavePrompt
					allowedPaths={CC_EDIT_ALLOWED_PATHS}
					onConfirm={onFieldSubmit}
					shouldBlockNavigationOnConfirm
					when={hasChanges}
				/>
			</>
		);
	};

	return (
		<>
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
		</>
	);
};

export default ContentTypesCCEdit;
