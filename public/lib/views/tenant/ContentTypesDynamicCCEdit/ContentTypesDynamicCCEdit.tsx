import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection, NavList } from '@acpaas-ui/react-editorial-components';
import {
	alertService,
	DataLoader,
	LeavePrompt,
	RenderChildRoutes,
	useDetectValueChangesWorker,
	useTenantContext,
} from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import { equals, isEmpty, omit } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';
import { ALERT_CONTAINER_IDS, MODULE_PATHS } from '../../../contentTypes.const';
import { ContentTypesDetailRouteProps, LoadingState } from '../../../contentTypes.types';
import { filterCompartments, validateCompartments } from '../../../helpers';
import {
	useCompartments,
	useCompartmentValidation,
	useNavigate,
	useNavItemMatcher,
} from '../../../hooks';
import useActiveField from '../../../hooks/useActiveField/useActiveField';
import useDynamicActiveField from '../../../hooks/useDynamicActiveField/useDynamicActiveField';
import useDynamicField from '../../../hooks/useDynamicField/useDynamicField';
import { Preset, PresetDetail } from '../../../services/presets';
import { ContentTypeFieldDetailModel, contentTypesFacade } from '../../../store/contentTypes';
import { dynamicFieldFacade } from '../../../store/dynamicField/dynamicField.facade';
import { compartmentsFacade } from '../../../store/ui/compartments';

import {
	DYNAMIC_CC_EDIT_ALLOWED_PATHS,
	DYNAMIC_CC_EDIT_COMPARTMENTS,
} from './ContentTypesDynamicCCEdit.const';

const ContentTypesDynamicCCEdit: FC<ContentTypesDetailRouteProps<{
	contentTypeUuid: string;
	contentComponentUuid: string;
	dynamicContentComponentUuid: string;
}>> = ({ match, contentType, route }) => {
	const { contentTypeUuid, contentComponentUuid, dynamicContentComponentUuid } = match.params;

	/**
	 * Hooks
	 */
	const [hasSubmit, setHasSubmit] = useState(false);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const activeCompartmentFormikRef = useRef<FormikProps<FormikValues>>();
	const activeField = useActiveField();
	const dynamicField = useDynamicField();
	const dynamicActiveField = useDynamicActiveField();
	const { generatePath, navigate } = useNavigate();
	const { tenantId } = useTenantContext();
	const [t] = useCoreTranslation();
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);
	const navItemMatcher = useNavItemMatcher(
		dynamicActiveField?.preset as PresetDetail,
		dynamicActiveField?.fieldType
	);
	const [hasChanges] = useDetectValueChangesWorker(
		initialLoading === LoadingState.Loaded,
		dynamicActiveField,
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
		to: generatePath(c.slug || c.name, {
			contentTypeUuid,
			contentComponentUuid,
			dynamicContentComponentUuid,
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
		if (!activeField) {
			return;
		}

		register(filterCompartments(DYNAMIC_CC_EDIT_COMPARTMENTS, navItemMatcher), {
			replace: true,
		});

		return () => {
			compartmentsFacade.clearCompartments();
		};
	}, [activeField, navItemMatcher]); // eslint-disable-line

	useEffect(() => {
		if (activeField) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [activeField]);

	useEffect(() => {
		if (
			!contentComponentUuid ||
			!Array.isArray(contentType.fields) ||
			(activeField && activeField.uuid === contentComponentUuid)
		) {
			return;
		}

		const newActiveField = contentType.fields.find(
			field => field.uuid === contentComponentUuid
		);

		if (newActiveField) {
			contentTypesFacade.setActiveField(newActiveField);
		}
	}, [activeField, contentComponentUuid, contentType, contentType.fields]);

	useEffect(() => {
		if (
			!dynamicContentComponentUuid ||
			!Array.isArray(dynamicField?.config?.fields) ||
			dynamicActiveField?.uuid === dynamicContentComponentUuid ||
			!dynamicField
		) {
			return;
		}

		const field = (dynamicField?.config?.fields || []).find(
			f => f.uuid === dynamicContentComponentUuid
		);

		if (!field) {
			return;
		}

		dynamicFieldFacade.setActiveField(field);
	}, [dynamicContentComponentUuid, activeField, dynamicActiveField, dynamicField]);

	/**
	 * Methods
	 */
	const navigateToDetail = (): void => {
		navigate(
			activeField?.__new ? MODULE_PATHS.detailCCNewConfig : MODULE_PATHS.detailCCEditConfig,
			{ contentTypeUuid, contentComponentUuid },
			{
				// This will keep the current active field (paragraaf) in state when we redirect.
				// Changes made to the configuration of this field will not be overwritten
				keepActiveField: !!activeField?.__new,
			},
			new URLSearchParams(
				activeField?.__new
					? {
							fieldType: activeField.fieldType.uuid,
							name: activeField.label,
					  }
					: {}
			)
		);
	};

	const onFieldChange = (data: ContentTypeFieldDetailModel): void => {
		validateCompartments(
			compartments,
			data,
			validate,
			dynamicActiveField?.fieldType,
			(dynamicActiveField?.preset as unknown) as Preset
		);
		dynamicFieldFacade.updateActiveField({
			...data,
		});
	};

	const onFieldDelete = (): void => {
		if (!dynamicActiveField?.uuid) {
			return;
		}

		dynamicFieldFacade.deleteField(dynamicActiveField.uuid);
		dynamicFieldFacade.clearActiveField();
		navigateToDetail();
	};

	const onFieldSubmit = (): void => {
		if (!dynamicActiveField) {
			return;
		}

		const { current: formikRef } = activeCompartmentFormikRef;
		const compartmentsAreValid = validateCompartments(
			compartments,
			dynamicActiveField,
			validate,
			dynamicActiveField?.fieldType,
			(dynamicActiveField?.preset as unknown) as Preset
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
			dynamicFieldFacade.updateField(omit(['__new'])(dynamicActiveField));
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

		setHasSubmit(false);
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
			fieldType: dynamicActiveField?.fieldType,
			preset: dynamicActiveField?.preset,
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
				<LeavePrompt
					allowedPaths={DYNAMIC_CC_EDIT_ALLOWED_PATHS}
					onConfirm={onFieldSubmit}
					shouldBlockNavigationOnConfirm
					when={hasChanges}
				/>
			</>
		);
	};
	return <DataLoader loadingState={initialLoading} render={renderCCEdit} />;
};

export default ContentTypesDynamicCCEdit;
