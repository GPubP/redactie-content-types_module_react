import { StatusTypes } from './typeMap.const';

export type StatusType = StatusTypes.active | StatusTypes.inactive | StatusTypes.archived;

export type TypeMap = {
	[key in StatusType]: string;
};
