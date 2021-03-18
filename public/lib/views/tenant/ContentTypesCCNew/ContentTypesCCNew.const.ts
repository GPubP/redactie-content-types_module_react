import { MODULE_PATHS, TENANT_ROOT } from '../../../contentTypes.const';
import {
	configurationCompartmentValidator,
	defaultValueCompartmentValidator,
	settingsCompartmentValidator,
	validationCompartmentValidator,
} from '../../../helpers';
import { CompartmentModel, CompartmentType } from '../../../store/ui/compartments';

export const CC_NEW_COMPARTMENTS: CompartmentModel[] = [
	{
		name: 'settings',
		label: 'Instellingen',
		slug: MODULE_PATHS.detailCCNewSettings,
		type: CompartmentType.INTERNAL,
		isValid: false,
		validate: settingsCompartmentValidator,
	},
	{
		name: 'configuration',
		label: 'Configuratie',
		slug: MODULE_PATHS.detailCCNewConfig,
		type: CompartmentType.INTERNAL,
		isValid: false,
		filter: ctField => !!ctField?.data?.formSchema?.fields?.length,
		validate: configurationCompartmentValidator,
	},
	{
		name: 'validation',
		label: 'Validatie',
		slug: MODULE_PATHS.detailCCNewValidation,
		type: CompartmentType.INTERNAL,
		filter: ctField => !!ctField?.data?.validators?.length,
		validate: validationCompartmentValidator,
	},
	{
		name: 'default',
		label: 'Standaard waarde',
		slug: MODULE_PATHS.detailCCNewDefaults,
		type: CompartmentType.INTERNAL,
		validate: defaultValueCompartmentValidator,
		filter: (ctField, compartments) =>
			compartments.configuration.isValid && !!ctField?.data?.generalConfig?.allowDefault,
	},
];

export const CC_NEW_ALLOWED_PATHS = [
	`${TENANT_ROOT}${MODULE_PATHS.detailCCNew}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCNewSettings}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCNewConfig}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCNewValidation}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCNewDefaults}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditDynamicEdit}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditDynamicEditSettings}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditDynamicNew}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditDynamicNewSettings}`,
];
