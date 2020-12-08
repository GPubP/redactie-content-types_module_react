import { CacheEntityState, CacheEntityUI, CacheEntityUIState } from '@redactie/utils';

import { FieldType } from '../../../services/fieldTypes';

export type FieldTypeDetailModel = FieldType;
export type FieldTypeDetailUIModel = CacheEntityUI;

export type FieldTypesDetailState = CacheEntityState<FieldTypeDetailModel, string>;

export type FieldTypesDetailUIState = CacheEntityUIState<FieldTypeDetailUIModel>;
