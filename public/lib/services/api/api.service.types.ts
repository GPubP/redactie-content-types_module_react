export interface SearchParams {
	skip: number;
	limit: number;
	search?: Array<string>;
	sort?: string;
	direction?: number;
}
