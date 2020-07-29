import { ContentTypeField } from '../../services/contentTypes';
import { ContentTypeModel } from '../../store/contentTypes';
import { DynamicFieldDetailModel } from '../../store/dynamicField/dynamicField.model';

import { TitleTypes } from './contentTypeTitleHelper.types';

export const contentTypeTitleHelper = (type: TitleTypes) => (
	ct?: ContentTypeModel,
	field?: ContentTypeField,
	dynField?: DynamicFieldDetailModel
) => {
	switch (type) {
		case TitleTypes.DynamicField:
			return `${dynField?.label || 'Vrije paragraaf'} bewerken`;
		case TitleTypes.Field:
			return `${field?.label || 'Content component'} bewerken`;
		case TitleTypes.ContentType:
		default:
			return `${ct?.meta?.label || 'Content-type'} bewerken`;
	}
};
