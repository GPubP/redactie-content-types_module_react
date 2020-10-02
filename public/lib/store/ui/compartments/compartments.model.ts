import { ActiveState, EntityState } from '@datorama/akita';

import { FieldType, FieldTypeData } from '../../../services/fieldTypes';

export type ModuleValue = any;
export enum CompartmentType {
	'INTERNAL',
	'MODULE',
}

export interface CompartmentRegisterOptions {
	/**
	 * Replace existing compartments
	 */
	replace?: true;
	/**
	 * Clear all compartments before adding
	 */
	reset?: true;
}

export interface CompartmentModel {
	name: string;
	label: string;
	getDescription?: (contentItem: FieldTypeData | undefined) => string | undefined;
	filter?: (meta: FieldType) => boolean;
	slug?: string;
	type: CompartmentType;
	isValid?: boolean;
	validate?: (values: FieldTypeData) => boolean;
}

export interface CompartmentState extends EntityState<CompartmentModel, string>, ActiveState {}

export const createInitialCompartmentState = (): CompartmentState => ({
	active: null,
});
