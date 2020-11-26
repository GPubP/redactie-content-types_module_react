import { OrderBy } from '../../views';

export const parseOrderBy = (orderBy: OrderBy): string => {
	return orderBy.order === 'asc' ? orderBy.key : `-${orderBy.key}`;
};

export const parseOrderByString = (orderByString = ''): OrderBy => {
	const keys = orderByString.split('.');
	const isDesc = orderByString.includes('-');
	return {
		key: keys[1],
		order: isDesc ? 'desc' : 'asc',
	};
};
