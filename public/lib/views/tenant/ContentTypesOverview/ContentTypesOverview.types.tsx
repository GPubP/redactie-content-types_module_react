export interface ContentTypesOverviewTableRow {
	uuid: string;
	label: string;
	description: string;
	contentItemCount: number;
	deleted: boolean;
	navigate: (contentTypeUuid: string) => void;
}
