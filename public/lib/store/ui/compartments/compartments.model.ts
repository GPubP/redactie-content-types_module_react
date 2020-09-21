import { ActiveState, EntityState } from '@datorama/akita';

import { FieldTypeData } from '../../../services/fieldTypes';

export type ModuleValue = any;
export enum CompartmentType {
	'INTERNAL',
	'MODULE',
}

export interface CompartmentRegisterOptions {
	replace?: true;
}

export interface CompartmentModel {
	name: string;
	label: string;
	getDescription?: (contentItem: FieldTypeData | undefined) => string | undefined;
	slug?: string;
	type: CompartmentType;
	isValid?: boolean;
	validate?: (values: FieldTypeData) => boolean;
}

export interface CompartmentState extends EntityState<CompartmentModel, string>, ActiveState {}

export const createInitialCompartmentState = (): CompartmentState => ({
	active: null,
});
