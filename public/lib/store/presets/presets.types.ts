export interface PresetUIModel {
	isFetching: boolean;
	isCreating: boolean;
	error?: any;
}

export interface GetPresetsPayloadOptions {
	alertContainerId: string;
}

export interface GetPresetsPaginatedPayloadOptions {
	clearCache?: boolean;
	alertContainerId?: string;
}

export interface GetPresetPayloadOptions {
	force?: boolean;
	alertContainerId?: string;
}

export interface CreatePresetPayloadOptions {
	successAlertContainerId: string;
	errorAlertContainerId: string;
}

export interface UpdatePresetPayloadOptions {
	alertContainerId: string;
}
