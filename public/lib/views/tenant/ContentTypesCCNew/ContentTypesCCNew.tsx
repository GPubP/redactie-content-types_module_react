import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection, NavList } from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { alertService, LeavePrompt, useDetectValueChanges } from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import kebabCase from 'lodash.kebabcase';
import { equals, isEmpty } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { DataLoader, RenderChildRoutes } from '../../../components';
import { useCoreTranslation } from '../../../connectors/translations';
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
	useTenantContext,
} from '../../../hooks';
import { ContentTypeFieldDetailModel, contentTypesFacade } from '../../../store/contentTypes';
import { fieldTypesFacade } from '../../../store/fieldTypes';
import { presetsFacade } from '../../../store/presets';

import { CC_NEW_COMPARTMENTS } from './ContentTypesCCNew.const';

const ContentTypesCCNew: FC<ContentTypesDetailRouteProps> = ({ match, route }) => {
	const { contentTypeUuid } = match.params;

	/**
	 * Hooks
	 */
	const [hasSubmit, setHasSubmit] = useState(false);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const activeCompartmentFormikRef = useRef<FormikProps<FormikValues>>();
	const activeField = useActiveField();
	const { fieldType: fieldTypeUuid, preset: presetUuid, name } = useQuery();
	const [fieldTypeLoadingState, fieldType] = useFieldType();
	const [presetLoadingState, preset] = usePreset();
	const { generatePath, navigate } = useNavigate();
	const { tenantId } = useTenantContext();
	const [t] = useCoreTranslation();
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
		to: generatePath(c.slug || c.name, { contentTypeUuid }),
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
	}, [fieldType]); // eslint-disable-line

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
	const navigateToDetail = (): void => {
		navigate(MODULE_PATHS.detailCC, { contentTypeUuid });
	};

	const onCTSubmit = (cancelNavigation = false): void => {
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
			contentTypesFacade.addField(activeField);
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

	const renderCCNew = (): ReactElement | null => (
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
						<Button className="u-margin-left-xs" onClick={onCTSubmit} type="primary">
							{t(CORE_TRANSLATIONS.BUTTON_NEXT)}
						</Button>
					</div>
				</ActionBarContentSection>
			</ActionBar>
			<LeavePrompt when={hasChanges} onConfirm={() => onCTSubmit(true)} />
		</>
	);

	return <DataLoader loadingState={initialLoading} render={renderCCNew} />;
};

export default ContentTypesCCNew;
