export interface ContentTypeDetailCCRow {
	navigate: () => void;
	label: string;
	name: string;
	fieldType: string;
	multiple: boolean;
	required: boolean;
	translatable: boolean;
	hidden: boolean;
}
