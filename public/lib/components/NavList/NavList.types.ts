import { NavLinkProps } from 'react-router-dom';

export interface NavListpropsItem {
	label: string;
	to: NavLinkProps['to'];
	filter?: (itemMeta: any) => boolean | undefined;
	meta?: any;
}

export interface NavListProps {
	items: NavListpropsItem[];
}
