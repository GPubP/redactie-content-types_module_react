import { Button, Card, CardBody, CardDescription, CardTitle } from '@acpaas-ui/react-components';
import React, { FC } from 'react';

import { FormCCSettings } from '../../components';
import { generateCCFormState } from '../../contentTypes.helpers';
import { CCSettingsFormState, ContentTypesCCRouteProps } from '../../contentTypes.types';

const ContentTypesCCSettings: FC<ContentTypesCCRouteProps> = ({ CTField, onDelete, onSubmit }) => {
	/**
	 * Render
	 */
	return (
		<>
			<FormCCSettings
				initialValues={generateCCFormState(CTField)}
				onSubmit={(data: CCSettingsFormState) => {
					onSubmit(data);
				}}
			/>
			{onDelete && (
				<Card>
					<CardBody>
						<CardTitle>Verwijderen</CardTitle>
						<CardDescription>
							Opgelet, indien u deze component verwijdert kan hij niet meer gebruikt
							worden op het content
						</CardDescription>
						<Button iconLeft="trash" onClick={onDelete} type="danger">
							Verwijderen
						</Button>
					</CardBody>
				</Card>
			)}
		</>
	);
};

export default ContentTypesCCSettings;
