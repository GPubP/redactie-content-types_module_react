export interface ContentTypeDetailCCRow {
	id: string;
	label: string;
	path?: string;
	name?: string;
	multiple?: boolean;
	fieldType?: string;
	required?: boolean;
	hidden?: boolean;
	translatable?: boolean;
	rows?: ContentTypeDetailCCRow[];
	canMoveUp: boolean;
	canMoveDown: boolean;
	isCompartment: boolean;
	navigate?: () => void;
}

export enum MoveAction {
	UP = 'up',
	DOWN = 'down',
}

export interface RowDnDEvent {
	index: number;
	type: string;
	id: string;
}
