import { BaseEntityState } from '@redactie/utils';

import { MetadataResponse } from '../../services/metadata';

export type MetadataModel = MetadataResponse;

export interface MetadataState extends BaseEntityState<MetadataModel, string> {
	metadata: MetadataModel;
}
