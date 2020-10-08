import { FORM_CC_SETTINGS_VALIDATION_SCHEMA } from '../../../components/forms/FormCCSettings/FormCCSettings.const';
import { MODULE_PATHS, TENANT_ROOT } from '../../../contentTypes.const';
import { FieldType } from '../../../services/fieldTypes';
import { CompartmentModel, CompartmentType } from '../../../store/ui/compartments';

export const DYNAMIC_CC_EDIT_COMPARTMENTS: CompartmentModel[] = [
	{
		label: 'Instellingen',
		name: 'settings',
		slug: MODULE_PATHS.detailCCEditDynamicEditSettings,
		type: CompartmentType.INTERNAL,
		isValid: false,
		validate: values => FORM_CC_SETTINGS_VALIDATION_SCHEMA.isValidSync(values),
	},
	{
		label: 'Configuratie',
		name: 'configuartion',
		slug: MODULE_PATHS.detailCCEditDynamicEditConfig,
		filter: (ctField: FieldType) => !!ctField?.data?.formSchema?.fields?.length,
		type: CompartmentType.INTERNAL,
	},
	{
		label: 'Validatie',
		name: 'validation',
		slug: MODULE_PATHS.detailCCEditDynamicEditValidation,
		filter: (ctField: FieldType) => !!ctField?.data?.validators?.length,
		type: CompartmentType.INTERNAL,
	},
	{
		label: 'Standaard waarde',
		name: 'default',
		slug: MODULE_PATHS.detailCCEditDynamicEditDefaults,
		type: CompartmentType.INTERNAL,
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
