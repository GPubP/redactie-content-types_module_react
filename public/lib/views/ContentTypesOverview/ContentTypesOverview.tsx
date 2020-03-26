import { Button } from '@acpaas-ui/react-components';
import {
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import React, { FC } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ContentTypesOverview: FC<any> = () => {
	return (
		<>
			<ContextHeader title="Content types">
				<ContextHeaderTopSection>Breadcrumbs</ContextHeaderTopSection>
				<ContextHeaderActionsSection>
					<Button iconLeft="plus">Nieuwe maken</Button>
				</ContextHeaderActionsSection>
			</ContextHeader>
		</>
	);
};

export default ContentTypesOverview;
