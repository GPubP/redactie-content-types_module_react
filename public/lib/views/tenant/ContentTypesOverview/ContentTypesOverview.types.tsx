export interface ContentTypesOverviewTableRow {
	uuid: string;
	label: string;
	description: string;
	contentItemCount: number;
	deleted: boolean;
	navigate: (contentTypeUuid: string) => void;
}

export interface FilterItemSchema {
	key?: string;
	value: string;
	valuePrefix?: string;
	filterKey: string;
	formvalue?: any;
}

export interface FilterItemsSchema {
	data: FilterItemSchema[];
}
