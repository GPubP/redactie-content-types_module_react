import React, { FC, useEffect } from 'react';

import {
	ContentTypeDetailMatchProps,
	ContentTypesSiteDetailRoutePropsParams,
	ExternalTabValue,
	Tab,
} from '../../../contentTypes.types';
import { mapExternalTabToTab } from '../../../helpers';
import { useExternalTabsFacade } from '../../../store/api/externalTabs';

const ContentTypesUpdateExternal: FC<ContentTypesSiteDetailRoutePropsParams<
	ContentTypeDetailMatchProps
>> = ({ contentType, onCancel, onSubmit, match, isLoading }) => {
	const { tab, siteId } = match.params;

	/**
	 * HOOKS
	 */
	const [{ active: activeTab }, activate] = useExternalTabsFacade();

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

		const moduleSettings = (contentType.modulesConfig || []).find(
			moduleConfig => moduleConfig.name === activeTab.id && moduleConfig.site === siteId
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

export default ContentTypesUpdateExternal;
