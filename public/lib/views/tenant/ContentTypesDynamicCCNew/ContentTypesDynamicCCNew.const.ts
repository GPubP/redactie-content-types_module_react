import { FORM_CC_SETTINGS_VALIDATION_SCHEMA } from '../../../components/forms/FormCCSettings/FormCCSettings.const';
import { MODULE_PATHS } from '../../../contentTypes.const';
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
	},
	{
		label: 'Validatie',
		name: 'validation',
		slug: MODULE_PATHS.detailCCEditDynamicNewValidation,
		filter: (CtField: FieldType) => !!CtField?.data?.validators?.length,
		type: CompartmentType.INTERNAL,
	},
	{
		label: 'Standaard waarde',
		name: 'default',
		slug: MODULE_PATHS.detailCCEditDynamicNewDefaults,
		type: CompartmentType.INTERNAL,
	},
];
