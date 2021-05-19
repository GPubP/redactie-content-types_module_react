import { AlertProps, alertService } from '@redactie/utils';

import { ALERT_CONTAINER_IDS } from '../../contentTypes.const';

export const showAlert = (
	containerId: string,
	type: 'success' | 'error',
	alertProps?: AlertProps
): void => {
	if (!alertProps || !containerId) {
		return;
	}
	const alertType = type === 'error' ? 'danger' : type;
	const alertOptions = { containerId };

	const alertFn = alertService[alertType];

	if (typeof alertFn === 'function') {
		alertFn.call(alertService, alertProps, alertOptions);
	}
};

export const COMPARTMENT_ERROR_DEFAULTS = {
	title: 'Opgelet',
	message:
		'Er staan fouten in het formulier op deze pagina of je bent iets vergeten invullen. Gelieve de gemarkeerde velden na te kijken.',
	containerId: ALERT_CONTAINER_IDS.update,
};

export const showCompartmentErrorAlert = ({
	title,
	message,
	containerId,
} = COMPARTMENT_ERROR_DEFAULTS): void => {
	alertService.danger({ title, message }, { containerId });
};
