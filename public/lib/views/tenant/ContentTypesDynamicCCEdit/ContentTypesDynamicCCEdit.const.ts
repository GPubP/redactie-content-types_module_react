import { MODULE_PATHS, TENANT_ROOT } from '../../../contentTypes.const';
import {
	configurationCompartmentValidator,
	settingsCompartmentValidator,
	validationCompartmentValidator,
} from '../../../helpers';
import { FieldType } from '../../../services/fieldTypes';
import { CompartmentModel, CompartmentType } from '../../../store/ui/compartments';

export const DYNAMIC_CC_EDIT_COMPARTMENTS: CompartmentModel[] = [
	{
		label: 'Instellingen',
		name: 'settings',
		slug: MODULE_PATHS.detailCCEditDynamicEditSettings,
		type: CompartmentType.INTERNAL,
		isValid: false,
		validate: settingsCompartmentValidator,
	},
	{
		label: 'Configuratie',
		name: 'configuartion',
		slug: MODULE_PATHS.detailCCEditDynamicEditConfig,
		type: CompartmentType.INTERNAL,
		filter: (ctField: FieldType) => !!ctField?.data?.formSchema?.fields?.length,
		validate: configurationCompartmentValidator,
	},
	{
		label: 'Validatie',
		name: 'validation',
		slug: MODULE_PATHS.detailCCEditDynamicEditValidation,
		type: CompartmentType.INTERNAL,
		filter: (ctField: FieldType) => !!ctField?.data?.validators?.length,
		validate: validationCompartmentValidator,
	},
	{
		label: 'Standaard waarde',
		name: 'default',
		slug: MODULE_PATHS.detailCCEditDynamicEditDefaults,
		type: CompartmentType.INTERNAL,
		filter: ctField => !!ctField?.data?.generalConfig?.allowDefault,
	},
];

export const DYNAMIC_CC_EDIT_ALLOWED_PATHS = [
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEdit}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditConfig}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCNew}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCNewConfig}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditDynamicEdit}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditDynamicEditSettings}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditDynamicEditConfig}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditDynamicEditValidation}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditDynamicEditDefaults}`,
];
