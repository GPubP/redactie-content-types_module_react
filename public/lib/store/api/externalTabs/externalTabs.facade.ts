import { ID } from '@datorama/akita';
import { ContentType } from '@redactie/roles-rights-module/dist/lib/roles.types';
import { useEffect, useState } from 'react';

import { CtBaseParams } from '../../../contentTypes.types';
import { onEmit } from '../../../helpers';
import { ContentTypeDetailResponse } from '../../../services/contentTypes';

import { ExternalTabModel } from './externalTabs.model';
import { externalTabsQuery } from './externalTabs.query';
import { externalTabsService, ExternalTabsService } from './externalTabs.service';

export const useExternalTabsFacade = (
	context: Partial<CtBaseParams> = {},
	contentType: ContentType | ContentTypeDetailResponse | null = null
): [
	{ all: ExternalTabModel[]; allVisible: ExternalTabModel[]; active: ExternalTabModel | null },
	ExternalTabsService['activate']
] => {
	const activate = (name: ID): void => externalTabsService.activate(name);

	const [all, setTabs] = useState<ExternalTabModel[]>([]);
	const [allVisible, setVisibleTabs] = useState<ExternalTabModel[]>([]);
	const [active, setActive] = useState<ExternalTabModel | null>(null);

	useEffect(() => {
		const subscriptions: any[] = [
			onEmit<ExternalTabModel[]>(externalTabsQuery.all$, all => setTabs(all)),
			onEmit<ExternalTabModel[]>(externalTabsQuery.allVisible$(context, contentType), all =>
				setVisibleTabs(all)
			),
			onEmit<ExternalTabModel>(externalTabsQuery.active$, active => setActive(active)),
		];

		return () => {
			subscriptions.map(it => it.unsubscribe());
		};
	}, [contentType, context?.ctType]); // eslint-disable-line react-hooks/exhaustive-deps

	return [{ all, allVisible, active }, activate];
};
