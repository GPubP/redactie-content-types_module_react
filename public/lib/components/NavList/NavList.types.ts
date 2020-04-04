import { NavLinkProps } from 'react-router-dom';

export interface NavListProps {
	items: { label: string; to: NavLinkProps['to'] }[];
}
