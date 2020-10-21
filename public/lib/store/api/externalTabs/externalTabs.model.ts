import { ActiveState, EntityState } from '@datorama/akita';
import { FC } from 'react';

import { ALERT_CONTAINER_IDS } from '../../../contentTypes.const';
import { ExternalTabProps } from '../../../views/tenant/ContentTypesDetailExternal';

export interface ExternalTabOptions {
	label: string;
	module: string;
	component: FC<ExternalTabProps>;
	replace?: boolean; // only replace existing if this is true (safety)
	containerId: ALERT_CONTAINER_IDS;
}

export interface ExternalTabModel {
	label: string;
	name: string;
	component: FC<ExternalTabProps>;
	module?: string;
	disabled?: boolean;
	containerId: ALERT_CONTAINER_IDS;
}

export interface ExternalTabsState extends EntityState<ExternalTabModel, string>, ActiveState {}

export const createInitialExternalTabsState = (): ExternalTabsState => ({
	active: null,
});
