import { ActiveState, EntityState } from '@datorama/akita';
import { ContentType } from '@redactie/roles-rights-module/dist/lib/roles.types';
import { FC } from 'react';

import { ALERT_CONTAINER_IDS } from '../../../contentTypes.const';
import { CtBaseParams } from '../../../contentTypes.types';
import { ContentTypeDetailResponse } from '../../../services/contentTypes';
import { ExternalTabProps } from '../../../views/tenant/ContentTypesDetailExternal';

export type ExternalTabShow = (
	context: Partial<CtBaseParams> & Record<string, any>,
	settings: ExternalTabModel,
	contentType: ContentType | ContentTypeDetailResponse | null
) => boolean | Promise<boolean>;

export interface ExternalTabOptions {
	label: string;
	module: string;
	component: FC<ExternalTabProps>;
	replace?: boolean; // only replace existing if this is true (safety)
	containerId: ALERT_CONTAINER_IDS;
	show?: ExternalTabShow;
}

export interface ExternalTabModel {
	label: string;
	name: string;
	component: FC<ExternalTabProps>;
	module?: string;
	disabled?: boolean;
	containerId: ALERT_CONTAINER_IDS;
	show?: ExternalTabShow;
}

export interface ExternalTabsState extends EntityState<ExternalTabModel, string>, ActiveState {}

export const createInitialExternalTabsState = (): ExternalTabsState => ({
	active: null,
});
