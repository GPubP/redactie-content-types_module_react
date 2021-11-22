import { LoadingState } from '@redactie/utils';
import React, { FC, useEffect, useMemo } from 'react';

import {
	ContentTypeDetailMatchProps,
	ContentTypesDetailRouteProps,
	ExternalTabValue,
	Tab,
} from '../../../contentTypes.types';
import { mapExternalTabToTab } from '../../../helpers';
import { useContentType } from '../../../hooks';
import { useExternalTabsFacade } from '../../../store/api/externalTabs/externalTabs.facade';

const ContentTypeDetailExternal: FC<ContentTypesDetailRouteProps<ContentTypeDetailMatchProps>> = ({
	contentType,
	onCancel,
	onSubmit,
	match,
}) => {
	const { tab } = match.params;

	/**
	 * HOOKS
	 */
	const [{ active: activeTab }, activate] = useExternalTabsFacade();
	const { updatingState: contentTypeIsUpdating } = useContentType();
	const isLoading = useMemo(() => {
		return contentTypeIsUpdating === LoadingState.Loading;
	}, [contentTypeIsUpdating]);

	useEffect(() => {
		activate(tab);
	}, [tab]); // eslint-disable-line

	/**
	 * METHODS
	 */

	const onExternalTabSubmit = (value: ExternalTabValue): void => {
		if (!activeTab) {
			return;
		}

		onSubmit(value, mapExternalTabToTab(activeTab));
	};

	const getExternalTabValue = (activeTab: Tab): ExternalTabValue => {
		if (!contentType) {
			return { config: {}, validationSchema: {} };
		}

		const moduleSettings = contentType.modulesConfig.find(
			moduleConfig => moduleConfig.name === activeTab.id
		);

		return {
			config: moduleSettings?.config || {},
			validationSchema: moduleSettings?.validationSchema || {},
		};
	};

	/**
	 * RENDER
	 */
	return activeTab ? (
		<activeTab.component
			contentType={contentType}
			onSubmit={(values: ExternalTabValue) => onExternalTabSubmit(values)}
			onCancel={() => onCancel()}
			updateContentType={() => null}
			value={getExternalTabValue(mapExternalTabToTab(activeTab))}
			isLoading={isLoading}
		/>
	) : null;
};

export default ContentTypeDetailExternal;
