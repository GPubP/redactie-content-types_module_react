import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import React, { FC } from 'react';

import { FormCCSettings } from '../../components';
import { ContentTypesCCRouteProps } from '../../contentTypes.types';
import { generateCCFormState } from '../../helpers';

const ContentTypesCCSettings: FC<ContentTypesCCRouteProps> = ({
	CTField,
	fieldTypeData,
	onDelete,
	onSubmit,
}) => {
	/**
	 * Render
	 */
	return (
		<>
			<h6 className="u-margin-bottom">Instellingen</h6>
			<FormCCSettings
				initialValues={generateCCFormState(CTField)}
				fieldTypeData={fieldTypeData}
				onSubmit={onSubmit}
			/>
			{onDelete && (
				<Card className="u-margin-top">
					<CardBody>
						<h6>Verwijderen</h6>
						<p className="u-margin-top-xs u-margin-bottom">
							Opgelet, indien u deze component verwijdert kan hij niet meer gebruikt
							worden op het content
						</p>
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
