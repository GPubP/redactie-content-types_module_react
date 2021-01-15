import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import React, { FC, useMemo } from 'react';

import { FormCCSettings } from '../../../components';
import { ContentTypesCCRouteProps } from '../../../contentTypes.types';
import { generateCCFormState } from '../../../helpers';

const ContentTypesCCSettings: FC<ContentTypesCCRouteProps> = ({
	CTField,
	fieldType,
	formikRef,
	onDelete,
	onSubmit,
}) => {
	const initialFormValues = useMemo(() => generateCCFormState(CTField), [CTField]);

	/**
	 * Render
	 */
	return (
		<>
			<h2 className="h3 u-margin-bottom">Instellingen</h2>
			<FormCCSettings
				initialValues={initialFormValues}
				fieldTypeData={fieldType.data}
				formikRef={formikRef}
				onSubmit={onSubmit}
				isUpdate={!!onDelete}
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
