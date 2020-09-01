export interface SearchParams extends Record<string, string | number | undefined> {
	skip: number;
	limit: number;
	search?: string;
	sort?: string;
	direction?: number;
}
