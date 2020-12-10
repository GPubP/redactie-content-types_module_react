import { AlertMessages } from '../../contentTypes.types';

export const FIELD_TYPES_ALERT_MESSAGES: AlertMessages<'fetch' | 'fetchOne'> = {
	fetch: {
		error: {
			title: 'Ophalen',
			message: 'Ophalen van content componenten is mislukt',
		},
	},
	fetchOne: {
		error: {
			title: 'Ophalen',
			message: 'Ophalen van content component is mislukt',
		},
	},
};
