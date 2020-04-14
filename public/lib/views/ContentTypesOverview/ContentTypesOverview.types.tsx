export interface ContentTypesOverviewTableRow {
	contentTypeUuid: string;
	name: string;
	description: string;
	status: string;
	navigate: (contentTypeUuid: string) => void;
}
