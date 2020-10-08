import { FORM_CC_SETTINGS_VALIDATION_SCHEMA } from '../../../components';
import { MODULE_PATHS, TENANT_ROOT } from '../../../contentTypes.const';
import { FieldType } from '../../../services/fieldTypes/fieldTypes.service.types';
import { CompartmentModel, CompartmentType } from '../../../store/ui/compartments';

export const CC_EDIT_COMPARTMENTS: CompartmentModel[] = [
	{
		label: 'Instellingen',
		name: 'settings',
		slug: MODULE_PATHS.detailCCEditSettings,
		type: CompartmentType.INTERNAL,
		isValid: false,
		validate: values => FORM_CC_SETTINGS_VALIDATION_SCHEMA.isValidSync(values),
	},
	{
		label: 'Configuratie',
		name: 'configuration',
		filter: (CtField: FieldType) => !!CtField?.data?.formSchema?.fields?.length,
		slug: MODULE_PATHS.detailCCEditConfig,
		type: CompartmentType.INTERNAL,
	},
	{
		label: 'Validatie',
		name: 'validation',
		filter: (CtField: FieldType) => !!CtField?.data?.validators?.length,
		slug: MODULE_PATHS.detailCCEditValidation,
		type: CompartmentType.INTERNAL,
	},
	{
		label: 'Standaard waarde',
		name: 'default',
		slug: MODULE_PATHS.detailCCEditDefaults,
		type: CompartmentType.INTERNAL,
	},
];

export const CC_EDIT_ALLOWED_PATHS = [
	`${TENANT_ROOT}${MODULE_PATHS.detailCC}`,
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
