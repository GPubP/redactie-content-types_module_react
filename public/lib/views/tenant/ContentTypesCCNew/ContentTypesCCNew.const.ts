import { FORM_CC_SETTINGS_VALIDATION_SCHEMA } from '../../../components/forms/FormCCSettings/FormCCSettings.const';
import { MODULE_PATHS } from '../../../contentTypes.const';
import { CompartmentModel, CompartmentType } from '../../../store/ui/compartments';

export const CC_NEW_COMPARTMENTS: CompartmentModel[] = [
	{
		name: 'settings',
		label: 'Instellingen',
		slug: MODULE_PATHS.detailCCNewSettings,
		type: CompartmentType.INTERNAL,
		isValid: false,
		validate: values => FORM_CC_SETTINGS_VALIDATION_SCHEMA.isValidSync(values),
	},
	{
		name: 'configuration',
		label: 'Configuratie',
		slug: MODULE_PATHS.detailCCNewConfig,
		type: CompartmentType.INTERNAL,
		filter: ctField => !!ctField?.data?.formSchema?.fields?.length,
	},
	{
		name: 'validation',
		label: 'Validatie',
		slug: MODULE_PATHS.detailCCNewValidation,
		type: CompartmentType.INTERNAL,
		filter: ctField => !!ctField?.data?.validators?.length,
	},
	{
		name: 'default',
		label: 'Standaard waarde',
		slug: MODULE_PATHS.detailCCNewDefaults,
		type: CompartmentType.INTERNAL,
	},
];
