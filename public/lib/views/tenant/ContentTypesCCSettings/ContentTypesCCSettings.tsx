import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import React, { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { FormCCSettings } from '../../../components';
import {
	ContentTypesCCRouteProps,
	ContentTypesRouteParams,
	CtTypes,
} from '../../../contentTypes.types';
import { generateCCFormState } from '../../../helpers';

const ContentTypesCCSettings: FC<ContentTypesCCRouteProps> = ({
	CTField,
	fieldType,
	formikRef,
	onDelete,
	onSubmit,
	contentType,
	preset,
	parentPreset,
}) => {
	const initialFormValues = useMemo(() => generateCCFormState(CTField), [CTField]);
	const { ctType } = useParams<ContentTypesRouteParams>();
	const isRemovable =
		(preset && preset?.data?.generalConfig?.removable !== false) ||
		fieldType?.data?.generalConfig?.removable !== false;

	const onChange = (data: any): void => {
		onSubmit({
			...CTField,
			...data,
			// Handle multiple in validation object
			validation: {
				...CTField.validation,
				type:
					CTField.preset && data.generalConfig.max > 1
						? 'array'
						: CTField.validation?.type || undefined,
				...(data.generalConfig.max > 1
					? {
							max: data.generalConfig.max,
							min: data.generalConfig.min || 0,
					  }
					: {
							// unset min/max when going from multiple to single
							min: undefined,
							max: undefined,
					  }),
			},
		});
	};

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
				onSubmit={onChange}
				isUpdate={!!onDelete}
			/>
			{onDelete && isRemovable && (
				<Card className="u-margin-top">
					<CardBody>
						<h6>Verwijderen</h6>
						<p className="u-margin-top-xs u-margin-bottom">
							Opgelet: indien je deze content component verwijdert kan hij niet meer
							gebruikt worden op het{' '}
							{ctType === CtTypes.contentTypes ? 'content type' : 'content blok'}{' '}
							&lsquo;
							{ctType === CtTypes.contentTypes
								? contentType?.meta?.label
								: parentPreset?.data.label}
							&rsquo;.
						</p>
						<Button iconLeft="trash-o" onClick={onDelete} type="danger">
							Verwijderen
						</Button>
					</CardBody>
				</Card>
			)}
		</>
	);
};

export default ContentTypesCCSettings;
