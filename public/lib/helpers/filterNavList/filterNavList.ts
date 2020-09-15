import { NavListItem } from '../../contentTypes.types';

export const filterNavList = (navListItems: NavListItem[], meta: any): NavListItem[] => {
	return navListItems.reduce<NavListItem[]>((acc, { filter, ...rest }) => {
		if (filter && !filter(meta)) {
			return acc;
		}

		return acc.concat([
			{
				...rest,
				activeClassName: 'is-active',
			},
		]);
	}, []);
};
