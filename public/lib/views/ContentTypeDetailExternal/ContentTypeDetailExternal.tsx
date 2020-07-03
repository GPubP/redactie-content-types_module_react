import { Container } from '@acpaas-ui/react-editorial-components';
import { clone } from 'ramda';
import React, { FC, useEffect } from 'react';

import { ContentTypesDetailRouteProps, Tab } from '../../contentTypes.types';
import { mapExternalTabToTab } from '../../helpers/mapExternalTabToTab/mapExternalTabToTab';
import { useExternalTabstFacade } from '../../store/api/externalTabs/externalTabs.facade';

import { ContentTypeDetailMatchProps, ExternalTabValue } from './ContentTypeDetailExternal.types';

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
	const [{ active: activeTab }, activate] = useExternalTabstFacade();

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
	return (
		<Container>
			{activeTab ? (
				<activeTab.component
					contentType={clone(contentType)}
					onSubmit={(values: ExternalTabValue) => onExternalTabSubmit(values)}
					onCancel={() => onCancel()}
					updateContentType={() => null}
					value={getExternalTabValue(mapExternalTabToTab(activeTab))}
				></activeTab.component>
			) : null}
		</Container>
	);
};

export default ContentTypeDetailExternal;
