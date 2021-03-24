import { MODULE_PATHS, TENANT_ROOT } from '../../../contentTypes.const';
import {
	configurationCompartmentValidator,
	settingsCompartmentValidator,
	validationCompartmentValidator,
} from '../../../helpers';
import { FieldType } from '../../../services/fieldTypes';
import { CompartmentModel, CompartmentType } from '../../../store/ui/compartments';

export const DYNAMIC_CC_NEW_COMPARTMENTS: CompartmentModel[] = [
	{
		label: 'Instellingen',
		name: 'settings',
		slug: MODULE_PATHS.detailCCEditDynamicNewSettings,
		type: CompartmentType.INTERNAL,
		validate: settingsCompartmentValidator,
	},
	{
		label: 'Configuratie',
		name: 'configuration',
		slug: MODULE_PATHS.detailCCEditDynamicNewConfig,
		type: CompartmentType.INTERNAL,
		filter: (CtField: FieldType) => !!CtField?.data?.formSchema?.fields?.length,
		validate: configurationCompartmentValidator,
	},
	{
		label: 'Validatie',
		name: 'validation',
		slug: MODULE_PATHS.detailCCEditDynamicNewValidation,
		type: CompartmentType.INTERNAL,
		filter: (CtField: FieldType) => !!CtField?.data?.validators?.length,
		validate: validationCompartmentValidator,
	},
	{
		label: 'Standaard waarde',
		name: 'default',
		slug: MODULE_PATHS.detailCCEditDynamicNewDefaults,
		type: CompartmentType.INTERNAL,
		filter: (ctField, compartments) =>
			!!compartments.configuration?.isValid && !!ctField?.data?.generalConfig?.allowDefault,
	},
];

export const DYNAMIC_CC_NEW_ALLOWED_PATHS = [
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEdit}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditConfig}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCNew}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCNewConfig}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditDynamicNew}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditDynamicNewSettings}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditDynamicNewConfig}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditDynamicNewValidation}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCEditDynamicNewDefaults}`,
];
