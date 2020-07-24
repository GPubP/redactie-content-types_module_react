import React, { FC, ReactElement } from 'react';
import { NavLink } from 'react-router-dom';

import { NavListProps } from './NavList.types';

const NavList: FC<NavListProps> = ({ items }) => {
	return (
		<ul className="m-nav-list">
			{items.reduce((acc, { label, to, filter, meta }, index) => {
				if (filter && !filter(meta)) {
					return acc;
				}

				return acc.concat([
					<li key={`nav-list-${index}`}>
						<NavLink activeClassName="is-active" to={to}>
							{label}
						</NavLink>
					</li>,
				]);
			}, [] as ReactElement[])}
		</ul>
	);
};

export default NavList;
