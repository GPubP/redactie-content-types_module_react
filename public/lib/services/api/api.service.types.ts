export interface SearchParams extends Record<string, string | number | boolean | undefined> {
	skip: number;
	limit: number;
	search?: string;
	sort?: string;
	direction?: number;
	hidden?: boolean;
}
