import { CacheEntityState } from '@redactie/utils';

import { FieldType } from '../../../services/fieldTypes';

export type FieldTypeListModel = FieldType;

export type FieldTypesListState = CacheEntityState<FieldTypeListModel, string>;
