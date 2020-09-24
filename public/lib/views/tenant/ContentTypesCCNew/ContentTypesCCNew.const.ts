import { MODULE_PATHS } from '../../../contentTypes.const';
import { FieldType } from '../../../services/fieldTypes';

export const CC_NEW_NAV_LIST_ITEMS = [
	{ label: 'Instellingen', to: MODULE_PATHS.detailCCNewSettings },
	{
		label: 'Configuratie',
		to: MODULE_PATHS.detailCCNewConfig,
		filter: (ctField: FieldType) => !!ctField?.data?.formSchema?.fields?.length,
	},
	{
		label: 'Validatie',
		to: MODULE_PATHS.detailCCNewValidation,
		filter: (ctField: FieldType) => !!ctField?.data?.validators?.length,
	},
	{ label: 'Standaard waarde', to: MODULE_PATHS.detailCCNewDefaults },
];
