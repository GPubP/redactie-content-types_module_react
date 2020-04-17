import { ContentTypeSchema } from '../../api/api.types';
import { ModuleSettings } from '../../services/contentTypes';

export interface ContentTypeDetailMatchProps {
	tab: string;
}

export interface ExternalTabValue {
	config: ModuleSettings['config'];
	validationSchema: ModuleSettings['validationSchema'];
}

export interface ExternalTabProps {
	contentType: ContentTypeSchema; // = deep clone
	value: ExternalTabValue;

	onSubmit: (value: ExternalTabValue) => void;
	onCancel: () => void;
	updateContentType: (e: ContentTypeSchema) => void;
}
