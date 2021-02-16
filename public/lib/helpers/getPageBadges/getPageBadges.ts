import { ContextHeaderBadge } from '@redactie/utils';

import { TitleTypes } from '../getPageTitle/getPageTitle.types'
import { ContentTypeModel, ContentTypeFieldDetailModel } from '../../store/contentTypes';

export const getPageBadges = (
	type: TitleTypes,
) => (
	activeField: ContentTypeFieldDetailModel,
	activeDynamicField: ContentTypeFieldDetailModel): ContextHeaderBadge[] => {
		switch (type) {
			case TitleTypes.DynamicField: {
				const dynamicFieldTypeLabel = activeDynamicField?.fieldType?.data?.label;

				return dynamicFieldTypeLabel ? [
					{
						name: dynamicFieldTypeLabel,
						type: 'primary',
					},
				] : [];
			}
			case TitleTypes.Field: {
				const fieldTypeLabel = activeField?.preset
				? activeField?.preset.data.label
				: activeField?.fieldType?.data.label;

				return fieldTypeLabel ? [
					{
						name: fieldTypeLabel,
						type: 'primary',
					},
				] : [];
			}
			case TitleTypes.ContentType:
			default:
				return [
					{
						name: 'Content type',
						type: 'primary',
					},
				];
		}
	};
