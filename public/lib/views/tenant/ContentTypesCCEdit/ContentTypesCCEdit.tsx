import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection, NavList } from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { alertService, LeavePrompt, useDetectValueChanges } from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import { equals, isEmpty } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { DataLoader, RenderChildRoutes } from '../../../components';
import { useCoreTranslation } from '../../../connectors/translations';
import { ALERT_CONTAINER_IDS, MODULE_PATHS } from '../../../contentTypes.const';
import { ContentTypesDetailRouteProps, LoadingState } from '../../../contentTypes.types';
import { filterCompartments, validateCompartments } from '../../../helpers';
import {
	useActiveField,
	useCompartments,
	useCompartmentValidation,
	useFieldType,
	useNavigate,
	useNavItemMatcher,
	usePreset,
	useTenantContext,
} from '../../../hooks';
import { ContentTypeFieldDetailModel, contentTypesFacade } from '../../../store/contentTypes';
import { fieldTypesFacade } from '../../../store/fieldTypes';
import { presetsFacade } from '../../../store/presets';

import { CC_EDIT_COMPARTMENTS } from './ContentTypesCCEdit.const';

const ContentTypesCCEdit: FC<ContentTypesDetailRouteProps> = ({ match, contentType, route }) => {
	const { contentTypeUuid, contentComponentUuid } = match.params;

	/**
	 * Hooks
	 */
	const [hasSubmit, setHasSubmit] = useState(false);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const activeCompartmentFormikRef = useRef<FormikProps<FormikValues>>();
	const [fieldTypeLoading, fieldType] = useFieldType();
	const [presetLoading, preset] = usePreset();
	const activeField = useActiveField();
	const { generatePath, navigate } = useNavigate();
	const { tenantId } = useTenantContext();
	const [t] = useCoreTranslation();
	const activeFieldFTUuid = useMemo(() => activeField?.fieldType.uuid, [activeField]);
	const activeFieldPSUuid = useMemo(() => activeField?.preset?.uuid, [activeField]);
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);
	const navItemMatcher = useNavItemMatcher(preset, fieldType);
	const [hasChanges] = useDetectValueChanges(!initialLoading, activeField);
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
	}, [fieldType]); // eslint-disable-line

	useEffect(() => {
		if (
			fieldTypeLoading !== LoadingState.Loading &&
			presetLoading !== LoadingState.Loading &&
			fieldType
		) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [fieldTypeLoading, fieldType, presetLoading]);

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
		}
	}, [activeField, activeFieldFTUuid, contentComponentUuid, contentType.fields]);

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
	const navigateToDetail = (): void => {
		navigate(MODULE_PATHS.detailCC, { contentTypeUuid });
	};

	const onFieldChange = (data: ContentTypeFieldDetailModel): void => {
		contentTypesFacade.updateActiveField(data);
	};

	const onFieldDelete = (): void => {
		if (activeField?.uuid) {
			contentTypesFacade.deleteField(activeField.uuid);
			contentTypesFacade.clearActiveField();
			navigateToDetail();
		}
	};

	const onFieldSubmit = (cancelNavigation = false): void => {
		if (!activeField) {
			return;
		}

		const { current: formikRef } = activeCompartmentFormikRef;
		const compartmentsAreValid = validateCompartments(compartments, activeField, validate);

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

			if (!cancelNavigation) {
				navigateToDetail();
			}
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

	/**
	 * Render
	 */
	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			CTField: activeField,
			fieldTypeData: fieldType?.data,
			preset,
			onDelete: onFieldDelete,
			onSubmit: onFieldChange,
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

	const renderCCEdit = (): ReactElement | null => {
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
								onClick={() => onFieldSubmit()}
								type="primary"
							>
								{t(CORE_TRANSLATIONS.BUTTON_NEXT)}
							</Button>
						</div>
					</ActionBarContentSection>
				</ActionBar>
				<LeavePrompt when={hasChanges} onConfirm={() => onFieldSubmit(true)} />
			</>
		);
	};

	return <DataLoader loadingState={initialLoading} render={renderCCEdit} />;
};

export default ContentTypesCCEdit;
