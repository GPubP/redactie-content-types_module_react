import { ActiveState, EntityState } from '@datorama/akita';
import { ContentType } from '@redactie/roles-rights-module/dist/lib/roles.types';
import { FC } from 'react';

import { ALERT_CONTAINER_IDS } from '../../../contentTypes.const';
import { CtBaseParams, ExternalTabProps } from '../../../contentTypes.types';
import { ContentTypeDetailResponse } from '../../../services/contentTypes';

export type ExternalTabShow = (
	context: Partial<CtBaseParams> & Record<string, any>,
	settings: ExternalTabModel,
	contentType: ContentType | ContentTypeDetailResponse | null
) => boolean | Promise<boolean>;

export type ExternalTabDisabled = (context: Record<string, any>) => boolean;

export interface ExternalTabOptions {
	label: string;
	module: string;
	component: FC<ExternalTabProps>;
	replace?: boolean; // only replace existing if this is true (safety)
	containerId: ALERT_CONTAINER_IDS;
	show?: ExternalTabShow;
	disabled?: boolean | ExternalTabDisabled;
}

export interface ExternalTabModel {
	label: string;
	name: string;
	component: FC<ExternalTabProps>;
	module?: string;
	containerId: ALERT_CONTAINER_IDS;
	show?: ExternalTabShow;
	disabled?: boolean | ExternalTabDisabled;
}

export interface ExternalTabsState extends EntityState<ExternalTabModel, string>, ActiveState {}

export const createInitialExternalTabsState = (): ExternalTabsState => ({
	active: null,
});
