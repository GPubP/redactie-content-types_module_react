export enum LoadingState {
	Loading = 'loading',
	Loaded = 'loaded',
	Error = 'error',
}

export interface DefaultComponentProps {
	className?: string;
}

export enum TabTypes {
	'INTERNAL',
	'EXTERNAL',
}

export interface Tab {
	name: string;
	target: string;
	active: boolean;
	type: TabTypes;
	disabled?: boolean;
}
