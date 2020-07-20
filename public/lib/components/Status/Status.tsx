import React, { FC } from 'react';

import { StatusTypes, typeMap } from '../../helpers';

import { StatusProps } from './Status.types';

const Status: FC<StatusProps> = ({ label = '', type = StatusTypes.active }) => {
	return <span className={`u-text-${typeMap[type]}`}>{label}</span>;
};

export default Status;
