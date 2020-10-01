import { CompartmentModel } from '../../store/ui/compartments';

export function filterCompartments(
	compartments: CompartmentModel[],
	meta: any
): CompartmentModel[] {
	return compartments.reduce<CompartmentModel[]>((acc, { filter, ...rest }) => {
		if (filter && !filter(meta)) {
			return acc;
		}

		return acc.concat([rest]);
	}, []);
}

export function validateCompartments(
	compartments: CompartmentModel[],
	values: any,
	setValidity: (compartmentId: string, isValid: boolean) => void
): boolean {
	// Create array of booleans from compartment validation
	const validatedCompartments: boolean[] = compartments.map(compartment => {
		if (compartment.validate) {
			const isValid = compartment.validate(values);
			setValidity(compartment.name, isValid);

			return isValid;
		}

		// Compartment is valid if no validate function is given
		return true;
	});

	// Return false if one of the compartments is invalid
	return !validatedCompartments.includes(false);
}
