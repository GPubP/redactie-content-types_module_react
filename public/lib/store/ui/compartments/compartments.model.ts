import { ActiveState, EntityState } from '@datorama/akita';
import { LanguageSchema } from '@redactie/language-module';

import { ContentTypeFieldDetail } from '../../../services/contentTypes';
import { FieldType, FieldTypeData } from '../../../services/fieldTypes';
import { Preset } from '../../../services/presets';

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
	filter?: (meta: FieldType, compartments: Record<string, { isValid: boolean }>) => boolean;
	slug?: string;
	type: CompartmentType;
	isValid?: boolean;
	isVisible?: boolean;
	validate?: (
		values: ContentTypeFieldDetail,
		fieldType?: FieldType,
		preset?: Preset,
		languages?: LanguageSchema[]
	) => boolean;
}

export interface CompartmentState extends EntityState<CompartmentModel, string>, ActiveState {}

export const createInitialCompartmentState = (): CompartmentState => ({
	active: null,
});
