export interface ContentTypesOverviewTableRow {
	uuid: string;
	label: string;
	description: string;
	fields: number;
	deleted: boolean;
	navigate: (contentTypeUuid: string) => void;
}

export interface ContentTypesPerSiteOverviewTableRow {
	uuid: string;
	label: string;
	description: string;
	contentItemCount: number;
	activated: boolean;
	navigate: (contentTypeUuid: string) => void;
}
