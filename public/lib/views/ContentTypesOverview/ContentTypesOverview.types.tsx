export interface ContentTypesOverviewTableRow {
	uuid: string;
	name: string;
	description: string;
	status: string;
	navigate: (contentTypeUuid: string) => void;
}
