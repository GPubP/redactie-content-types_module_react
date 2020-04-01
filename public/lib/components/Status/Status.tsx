import React, { FC } from 'react';

import { typeMap } from '../../helpers/typeMap/typeMap';
import { StatusTypes } from '../../helpers/typeMap/typeMap.const';

import { StatusProps } from './Status.types';

const Status: FC<StatusProps> = ({ label = '', type = StatusTypes.active }) => {
	return <span className={`u-text-${typeMap[type]}`}>{label}</span>;
};

export default Status;
