import { FORM_CC_SETTINGS_VALIDATION_SCHEMA } from '../../../components/forms/FormCCSettings/FormCCSettings.const';
import { MODULE_PATHS, TENANT_ROOT } from '../../../contentTypes.const';
import {
	configurationCompartmentValidator,
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
		isValid: false,
		validate: values => FORM_CC_SETTINGS_VALIDATION_SCHEMA.isValidSync(values),
	},
	{
		label: 'Configuratie',
		name: 'configuration',
		slug: MODULE_PATHS.detailCCEditDynamicNewConfig,
		filter: (CtField: FieldType) => !!CtField?.data?.formSchema?.fields?.length,
		type: CompartmentType.INTERNAL,
		validate: configurationCompartmentValidator,
	},
	{
		label: 'Validatie',
		name: 'validation',
		slug: MODULE_PATHS.detailCCEditDynamicNewValidation,
		filter: (CtField: FieldType) => !!CtField?.data?.validators?.length,
		type: CompartmentType.INTERNAL,
		validate: validationCompartmentValidator,
	},
	{
		label: 'Standaard waarde',
		name: 'default',
		slug: MODULE_PATHS.detailCCEditDynamicNewDefaults,
		type: CompartmentType.INTERNAL,
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
