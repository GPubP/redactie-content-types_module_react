import { Button, Card } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import kebabCase from 'lodash.kebabcase';
import { parse } from 'query-string';
import React, { FC, ReactElement, useState } from 'react';

import { DataLoader, NavList } from '../../components';
import { MODULE_PATHS } from '../../contentTypes.const';
import { generateCCFormState } from '../../contentTypes.helpers';
import { useFieldType, useNavigate } from '../../hooks';

import { CC_NAV_LIST_ITEMS } from './ContentTypesCCNew.const';
import { ContentTypesCCNewProps } from './ContentTypesCCNew.types';

const ContentTypesCCNew: FC<ContentTypesCCNewProps> = ({
	contentType,
	location,
	routes,
	onSubmit,
}) => {
	const { fieldType: fieldTypeUuid, name } = parse(location.search);
	const initalFieldValues = {
		name: (name as string | undefined) || '',
		label: kebabCase((name as string | undefined) || ''),
	};

	/**
	 * Hooks
	 */
	const [fieldFormState, setFieldFormState] = useState(generateCCFormState(initalFieldValues));
	const [loadingState, fieldType] = useFieldType(fieldTypeUuid as string | undefined);
	const { generatePath, navigate } = useNavigate();

	/**
	 * Methods
	 */
	const onCTSubmit = (): void => {
		onSubmit({
			...contentType,
			fields: [...contentType.fields, fieldFormState],
		});
		// Return to CC overview
		navigate(MODULE_PATHS.createCC);
	};

	/**
	 * Render
	 */
	const renderChildRoutes = (): any => {
		const activeRoute =
			routes.find(item => item.path === generatePath(MODULE_PATHS.createCCNew)) || null;

		// TODO: add redirect to settings

		return Core.routes.render(activeRoute?.routes as ModuleRouteConfig[], {
			fieldType,
			routes: activeRoute?.routes,
			fieldFormState: fieldFormState,
			onSubmit: (data: any) => setFieldFormState(data),
		});
	};

	const renderCCNew = (): ReactElement => {
		return (
			<div className="row between-xs top-xs">
				<div className="col-xs-3">
					<NavList items={CC_NAV_LIST_ITEMS} />
				</div>

				<div className="col-xs-9">
					<Card>
						<div className="u-margin">{renderChildRoutes()}</div>
					</Card>
				</div>

				<ActionBar show>
					<ActionBarContentSection>
						<Button onClick={onCTSubmit} type="success">
							Bewaar
						</Button>
						<Button onClick={navigate(MODULE_PATHS.createCC)} outline>
							Annuleer
						</Button>
					</ActionBarContentSection>
				</ActionBar>
			</div>
		);
	};

	return (
		<>
			<div className="u-container u-wrapper u-margin-top u-margin-bottom">
				<DataLoader loadingState={loadingState} render={renderCCNew} />
			</div>
		</>
	);
};

export default ContentTypesCCNew;
