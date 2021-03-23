import { useObservable } from '@redactie/utils';

import { filterCompartments } from '../../helpers/compartments';
import {
	CompartmentModel,
	CompartmentRegisterOptions,
	compartmentsFacade,
} from '../../store/ui/compartments';

interface CompartmentState {
	compartments: CompartmentModel[];
	visibleCompartments: CompartmentModel[];
	active: CompartmentModel | undefined;
}

const useCompartments = (): [
	CompartmentState,
	(compartments: CompartmentModel[], options: CompartmentRegisterOptions, meta?: any) => void,
	(name: string) => void,
	(name: string, isValid: boolean) => void,
	(name: string, isVisible: boolean) => void
] => {
	const register = (
		compartments: CompartmentModel[] | CompartmentModel,
		options: CompartmentRegisterOptions,
		meta?: any
	): void => {
		compartmentsFacade.register(compartments, options);
		filterCompartments(
			Array.isArray(compartments) ? compartments : [compartments],
			meta,
			compartmentsFacade.setIsVisible.bind(compartmentsFacade)
		);
	};
	const activate = (name: string): void => compartmentsFacade.setActiveByNamOrSlug(name);
	const validate = (name: string, isValid: boolean): void =>
		compartmentsFacade.setValid(name, isValid);
	const setIsVisible = (name: string, isVisible: boolean): void =>
		compartmentsFacade.setIsVisible(name, isVisible);

	const compartments = useObservable(compartmentsFacade.all$, []);
	const visibleCompartments = useObservable(compartmentsFacade.allVisible$, []);
	const active = useObservable(compartmentsFacade.active$);

	return [
		{ compartments, visibleCompartments, active },
		register,
		activate,
		validate,
		setIsVisible,
	];
};

export default useCompartments;
