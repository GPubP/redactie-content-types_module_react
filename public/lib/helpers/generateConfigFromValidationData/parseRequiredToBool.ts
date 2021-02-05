export const parseRequiredToBool = (required: any): boolean | null => {
	if (typeof required === 'boolean') {
		return required;
	}

	if (typeof required === 'string') {
		return required === 'true';
	}

	if (Array.isArray(required)) {
		return required.length > 0;
	}

	return null;
};
