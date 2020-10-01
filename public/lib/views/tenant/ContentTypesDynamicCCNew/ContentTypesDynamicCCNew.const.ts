import { MODULE_PATHS } from '../../../contentTypes.const';
import { FieldType } from '../../../services/fieldTypes';

export const CC_NAV_LIST_ITEMS = [
	{ label: 'Instellingen', to: MODULE_PATHS.detailCCEditDynamicNewSettings },
	{
		label: 'Configuratie',
		to: MODULE_PATHS.detailCCEditDynamicNewConfig,
		filter: (CtField: FieldType) => !!CtField?.data?.formSchema?.fields?.length,
	},
	{
		label: 'Validatie',
		to: MODULE_PATHS.detailCCEditDynamicNewValidation,
		filter: (CtField: FieldType) => !!CtField?.data?.validators?.length,
	},
	{ label: 'Standaard waarde', to: MODULE_PATHS.detailCCEditDynamicNewDefaults },
];
