import React, { FC } from 'react';

import { StatusIconProps } from './StatusIcon.types';

export const StatusIcon: FC<StatusIconProps> = ({ active }) => {
	return (
		<div className="u-text-center">
			{active ? (
				<span className="u-text-success fa fa-check"></span>
			) : (
				<span className="u-text-danger fa fa-close"></span>
			)}
		</div>
	);
};
