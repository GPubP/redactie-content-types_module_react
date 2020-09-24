import { MODULE_PATHS } from '../../../contentTypes.const';
import { FieldType } from '../../../services/fieldTypes/fieldTypes.service.types';

export const CC_EDIT_NAV_LIST_ITEMS = [
	{ label: 'Instellingen', to: MODULE_PATHS.detailCCEditSettings },
	{
		label: 'Configuratie',
		to: MODULE_PATHS.detailCCEditConfig,
		filter: (CtField: FieldType) => !!CtField?.data?.formSchema?.fields?.length,
	},
	{
		label: 'Validatie',
		to: MODULE_PATHS.detailCCEditValidation,
		filter: (CtField: FieldType) => !!CtField?.data?.validators?.length,
	},
	{ label: 'Standaard waarde', to: MODULE_PATHS.detailCCEditDefaults },
];
