import { FormikProps } from 'formik';
import { ReactNode } from 'react';

import { ContentTypeDetailModel } from '../../../store/contentTypes';

export type CTSettingsFormChildrenFn = (
	formikProps: FormikProps<ContentTypeDetailModel>
) => ReactNode;

export interface CTSettingsFormProps {
	children?: CTSettingsFormChildrenFn | ReactNode;
	contentType: ContentTypeDetailModel;
	disabled?: boolean;
	isUpdate?: boolean;
	onSubmit: (values: ContentTypeDetailModel | null) => void;
}
