import { ContextHeaderBadge } from '@redactie/utils';

import { CtTypes } from '../../contentTypes.types';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { ContentTypeFieldDetailModel } from '../../store/contentTypes';
import { TitleTypes } from '../getPageTitle/getPageTitle.types';

export const getPageBadges = (type: TitleTypes) => (
	activeField: ContentTypeFieldDetailModel,
	activeDynamicField: ContentTypeFieldDetailModel,
	context?: Record<string, any>
): ContextHeaderBadge[] => {
	switch (type) {
		case TitleTypes.DynamicField: {
			const dynamicFieldTypeLabel = activeDynamicField?.preset?.data?.label
				? activeDynamicField.preset.data.label
				: activeDynamicField?.fieldType?.data?.label;

			return dynamicFieldTypeLabel
				? [
						{
							name: dynamicFieldTypeLabel,
							type: 'primary',
						},
				  ]
				: [];
		}
		case TitleTypes.Field: {
			const fieldTypeLabel = activeField?.preset?.data?.label
				? activeField.preset.data.label
				: activeField?.fieldType?.data?.label;

			return fieldTypeLabel
				? [
						{
							name: fieldTypeLabel,
							type: 'primary',
						},
				  ]
				: [];
		}
		case TitleTypes.ContentType:
		default:
			return [
				{
					name:
						context?.t && context?.ctType
							? context.t(MODULE_TRANSLATIONS[context.ctType as CtTypes].BADGE_TYPE)
							: MODULE_TRANSLATIONS[CtTypes.contentTypes].BADGE_TYPE,
					type: 'primary',
				},
			];
	}
};
