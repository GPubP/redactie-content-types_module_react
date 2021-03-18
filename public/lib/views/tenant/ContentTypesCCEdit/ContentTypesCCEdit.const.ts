import { MODULE_PATHS, TENANT_ROOT } from '../../../contentTypes.const';
import {
	configurationCompartmentValidator,
	defaultValueCompartmentValidator,
	settingsCompartmentValidator,
	validationCompartmentValidator,
} from '../../../helpers';
import { FieldType } from '../../../services/fieldTypes/fieldTypes.service.types';
import { CompartmentModel, CompartmentType } from '../../../store/ui/compartments';

export const CC_EDIT_COMPARTMENTS: CompartmentModel[] = [
	{
		label: 'Instellingen',
		name: 'settings',
		slug: MODULE_PATHS.detailCCEditSettings,
		type: CompartmentType.INTERNAL,
		isValid: false,
		validate: settingsCompartmentValidator,
	},
	{
		label: 'Configuratie',
		name: 'configuration',
		slug: MODULE_PATHS.detailCCEditConfig,
		type: CompartmentType.INTERNAL,
		filter: (CtField: FieldType) => !!CtField?.data?.formSchema?.fields?.length,
		validate: configurationCompartmentValidator,
	},
	{
		label: 'Validatie',
		name: 'validation',
		slug: MODULE_PATHS.detailCCEditValidation,
		type: CompartmentType.INTERNAL,
		filter: (CtField: FieldType) => !!CtField?.data?.validators?.length,
		validate: validationCompartmentValidator,
	},
	{
		label: 'Standaard waarde',
		name: 'default',
		slug: MODULE_PATHS.detailCCEditDefaults,
		type: CompartmentType.INTERNAL,
		filter: (ctField, compartments) =>
			compartments.configuration.isValid && !!ctField?.data?.generalConfig?.allowDefault,
		validate: defaultValueCompartmentValidator,
	},
];

export const CC_EDIT_ALLOWED_PATHS = [
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEdit}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditSettings}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditConfig}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditValidation}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditDefaults}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditDynamicEdit}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditDynamicEditSettings}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditDynamicNew}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditDynamicNewSettings}`,
];
