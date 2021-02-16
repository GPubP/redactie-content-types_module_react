import React, { ReactElement } from 'react';

import { CORE_TRANSLATIONS } from '../../connectors/translations';
import { ContentTypeField } from '../../services/contentTypes';
import { ContentTypeModel } from '../../store/contentTypes';
import { DynamicFieldDetailModel } from '../../store/dynamicField/dynamicField.model';

import { TitleTypes } from './getPageTitle.types';

export const getPageTitle = (type: TitleTypes) => (
	ct: ContentTypeModel,
	field: ContentTypeField,
	dynField: DynamicFieldDetailModel,
	t: (keys: string | string[]) => string
) => {
	const getTitleElement = (label: string): ReactElement => (
		<>
			<i>{label}</i> {t(CORE_TRANSLATIONS.ROUTING_UPDATE)}
		</>
	);

	switch (type) {
		case TitleTypes.DynamicField:
			return getTitleElement(dynField?.label || 'Vrije paragraaf');
		case TitleTypes.Field:
			return getTitleElement(field?.label || 'Content component');
		case TitleTypes.ContentType:
		default:
			return getTitleElement(ct?.meta?.label || 'Content-type');
	}
};
