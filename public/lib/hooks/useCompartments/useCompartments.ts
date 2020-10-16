import { ID } from '@datorama/akita';
import { useObservable } from '@mindspace-io/react';

import {
	CompartmentModel,
	CompartmentRegisterOptions,
	compartmentsFacade,
} from '../../store/ui/compartments';

interface CompartmentState {
	compartments: CompartmentModel[];
	active: CompartmentModel | undefined;
}

const useCompartments = (): [
	CompartmentState,
	(compartments: CompartmentModel[], options: CompartmentRegisterOptions) => void,
	(names: ID) => void,
	(name: string, isValid: boolean) => void
] => {
	const register = (
		compartments: CompartmentModel[] | CompartmentModel,
		options: CompartmentRegisterOptions
	): void => {
		compartmentsFacade.register(compartments, options);
	};
	const activate = (name: ID): void => compartmentsFacade.setActiveByNamOrSlug(name);
	const validate = (name: string, isValid: boolean): void =>
		compartmentsFacade.setValid(name, isValid);

	const [compartments] = useObservable(compartmentsFacade.all$, []);
	const [active] = useObservable(compartmentsFacade.active$);

	return [{ compartments, active }, register, activate, validate];
};

export default useCompartments;