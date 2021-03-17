import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection, NavList } from '@acpaas-ui/react-editorial-components';
import {
	DataLoader,
	LeavePrompt,
	LoadingState,
	RenderChildRoutes,
	useDetectValueChangesWorker,
	useNavigate,
	useTenantContext,
} from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import kebabCase from 'lodash.kebabcase';
import { equals, isEmpty, omit } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';
import { MODULE_PATHS } from '../../../contentTypes.const';
import { ContentTypesDetailRouteProps } from '../../../contentTypes.types';
import {
	filterCompartments,
	generateFieldFromType,
	showCompartmentErrorAlert,
	validateCompartments,
} from '../../../helpers';
import {
	useActiveFieldType,
	useActivePreset,
	useCompartments,
	useCompartmentValidation,
	useDynamicField,
	useNavItemMatcher,
	useQuery,
} from '../../../hooks';
import useActiveField from '../../../hooks/useActiveField/useActiveField';
import useDynamicActiveField from '../../../hooks/useDynamicActiveField/useDynamicActiveField';
import { Preset } from '../../../services/presets';
import { ContentTypeFieldDetailModel } from '../../../store/contentTypes';
import { dynamicFieldFacade } from '../../../store/dynamicField/dynamicField.facade';
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
	const [preset, presetUI] = useActivePreset(presetUuid);
	const [fieldType, fieldTypeUI] = useActiveFieldType(
		preset ? preset?.data.fieldType.uuid : fieldTypeUuid
	);
	const activeField = useActiveField();
	const dynamicField = useDynamicField();
	const dynamicActiveField = useDynamicActiveField();
	const { generatePath, navigate } = useNavigate();
	const { tenantId } = useTenantContext();
	const [t] = useCoreTranslation();
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);
	const navItemMatcher = useNavItemMatcher(preset, fieldType);
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
		if (!fieldTypeUI?.isFetching && !presetUI?.isFetching && dynamicActiveField) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [dynamicActiveField, dynamicField, fieldTypeUI, presetUI]);

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
	}, [
		activeField,
		contentComponentUuid,
		contentType.fields,
		dynamicField,
		fieldType,
		fieldTypeUuid,
		preset,
		presetUuid,
	]);

	/**
	 * Generate a new field based on the selected fieldtype and
	 * make it the active working field in the store
	 */
	useEffect(() => {
		if (
			(!fieldType && !preset) ||
			(fieldType && fieldTypeUuid !== fieldType.uuid) ||
			(preset && presetUuid !== preset.uuid)
		) {
			dynamicFieldFacade.clearActiveField();
		}

		if (fieldType) {
			const label =
				preset?.data.label ||
				fieldType.data.label ||
				fieldType.data.generalConfig.defaultLabel ||
				'';
			const initialValues = {
				label,
				name: kebabCase(label),
				generalConfig: {
					guideline: fieldType.data.generalConfig.defaultGuideline || '',
				},
			};
			dynamicFieldFacade.setActiveField(
				generateFieldFromType(fieldType, initialValues, undefined, preset || undefined)
			);
		}
	}, [fieldType, fieldTypeUuid, preset, presetUuid]);

	/**
	 * Clear store on component destroy
	 */
	useEffect(
		() => () => {
			dynamicFieldFacade.clearActiveField();
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
			validate,
			dynamicActiveField?.fieldType,
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
			dynamicFieldFacade.addField(omit(['__new'])(dynamicActiveField));
			navigateToDetail();
		} else {
			showCompartmentErrorAlert();
		}

		setHasSubmit(true);
	};

	const onFieldTypeChange = (data: ContentTypeFieldDetailModel): void => {
		validateCompartments(
			compartments,
			dynamicActiveField,
			validate,
			dynamicActiveField?.fieldType,
			(preset as unknown) as Preset
		);
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
			fieldType: dynamicActiveField?.fieldType,
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
