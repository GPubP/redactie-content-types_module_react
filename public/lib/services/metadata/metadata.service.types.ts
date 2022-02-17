export interface MetadataResponse {
	uuid: string;
	ref: string;
	type: string;
	name: string;
	site: string;
	config: Record<string, any>;
	label: string;
}

export type MetadataUpdateRequest = MetadataResponse;
export type MetadataCreateRequest = Omit<MetadataResponse, 'uuid'>;
