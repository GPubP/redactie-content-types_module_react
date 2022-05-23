import { I18NextTranslations } from '@redactie/translations-module';
import { FormikProps, FormikValues } from 'formik';
import { ReactNode, Ref } from 'react';

import { ContentTypeDetailModel } from '../../../store/contentTypes';

export type CTSettingsFormChildrenFn = (
	formikProps: FormikProps<ContentTypeDetailModel>
) => ReactNode;

export interface CTSettingsFormProps {
	children?: CTSettingsFormChildrenFn | ReactNode;
	contentType: ContentTypeDetailModel;
	disabled?: boolean;
	isUpdate?: boolean;
	formikRef?: Ref<FormikProps<FormikValues>>;
	onSubmit: (values: ContentTypeDetailModel | null) => void;
	translations: I18NextTranslations;
	renderUrlPattern: boolean;
}
