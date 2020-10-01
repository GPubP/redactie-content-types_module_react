import { ActiveState, EntityState } from '@datorama/akita';
import { FC } from 'react';

import { ExternalTabProps } from '../../../views/tenant/ContentTypesDetailExternal';

export interface ExternalTabOptions {
	label: string;
	module: string;
	component: FC<ExternalTabProps>;
	replace?: boolean; // only replace existing if this is true (safety)
}

export interface ExternalTabModel {
	label: string;
	name: string;
	component: FC<ExternalTabProps>;
	module?: string;
}

export interface ExternalTabsState extends EntityState<ExternalTabModel, string>, ActiveState {}

export const createInitialExternalTabsState = (): ExternalTabsState => ({
	active: null,
});
