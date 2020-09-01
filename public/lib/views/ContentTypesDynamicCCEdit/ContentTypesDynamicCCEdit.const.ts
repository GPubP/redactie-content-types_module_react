import { MODULE_PATHS } from '../../contentTypes.const';
import { FieldType } from '../../services/fieldTypes';

export const CC_DYNAMIC_NAV_LIST_ITEMS = [
	{ label: 'Instellingen', to: MODULE_PATHS.detailCCEditDynamicEditSettings },
	{
		label: 'Configuratie',
		to: MODULE_PATHS.detailCCEditDynamicEditConfig,
		filter: (ctField: FieldType) =>
			(console.log(ctField) as any) || !!ctField?.data?.formSchema?.fields?.length,
	},
	{
		label: 'Validatie',
		to: MODULE_PATHS.detailCCEditDynamicEditValidation,
		filter: (ctField: FieldType) =>
			(console.log(ctField) as any) || !!ctField?.data?.validators?.length,
	},
	{ label: 'Standaard waarde', to: MODULE_PATHS.detailCCEditDynamicEditDefaults },
];
