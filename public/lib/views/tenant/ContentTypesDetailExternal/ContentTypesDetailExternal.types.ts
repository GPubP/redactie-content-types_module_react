import { ModuleSettings } from '../../../services/contentTypes';
import { ContentTypeDetailModel } from '../../../store/contentTypes';

export interface ContentTypeDetailMatchProps {
	tab: string;
}

export interface ExternalTabValue {
	config: ModuleSettings['config'];
	validationSchema: ModuleSettings['validationSchema'];
}

export interface ExternalTabProps {
	contentType: ContentTypeDetailModel; // = deep clone
	value: ExternalTabValue;
	isLoading: boolean;
	onSubmit: (value: ExternalTabValue) => void;
	onCancel: () => void;
	updateContentType: (e: ContentTypeDetailModel) => void;
}
