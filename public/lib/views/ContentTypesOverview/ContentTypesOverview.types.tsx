export interface ContentTypesOverviewTableRow {
	uuid: string;
	label: string;
	description: string;
	status: string;
	navigate: (contentTypeUuid: string) => void;
}

export interface OrderBy {
	key: string;
	order: string;
}
