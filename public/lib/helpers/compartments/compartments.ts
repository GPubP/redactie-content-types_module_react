import { FieldType } from '../../services/fieldTypes/fieldTypes.service.types';
import { Preset } from '../../services/presets';
import { CompartmentModel } from '../../store/ui/compartments';

export function filterCompartments(
	compartments: CompartmentModel[],
	meta: any,
	setVisibility: (compartmentId: string, isVisible: boolean) => void
): void {
	const compartmentsState = compartments.reduce((acc, compartment) => {
		acc[compartment.name] = {
			isValid: compartment.isValid ?? true,
		};
		return acc;
	}, {} as Record<string, { isValid: boolean }>);

	compartments.forEach(compartment => {
		if (typeof compartment.filter === 'function') {
			const isVisible = compartment.filter(meta, compartmentsState);
			setVisibility(compartment.name, isVisible);
		}
	});
}

export function validateCompartments(
	compartments: CompartmentModel[],
	visibleCompartments: CompartmentModel[],
	values: any,
	setValidity: (compartmentId: string, isValid: boolean) => void,
	setVisibility: (compartmentId: string, isVisible: boolean) => void,
	meta: FieldType,
	fieldType?: FieldType,
	preset?: Preset
): boolean {
	const validatedCompartments: Record<string, { isValid: boolean }> = visibleCompartments.reduce(
		(acc, compartment) => {
			if (compartment.validate) {
				const isValid = compartment.validate(values, fieldType, preset);
				setValidity(compartment.name, isValid);
				acc[compartment.name] = {
					isValid,
				};
				return acc;
			}

			acc[compartment.name] = {
				isValid: true,
			};
			return acc;
		},
		{} as Record<string, { isValid: boolean }>
	);

	// Run filters
	compartments.forEach(compartment => {
		if (typeof compartment.filter === 'function') {
			const isVisible = compartment.filter(meta, validatedCompartments);
			setVisibility(compartment.name, isVisible);
		}
	});

	// Return false if one of the compartments is invalid
	return !Object.keys(validatedCompartments)
		.map(compartmentName => validatedCompartments[compartmentName].isValid)
		.includes(false);
}
