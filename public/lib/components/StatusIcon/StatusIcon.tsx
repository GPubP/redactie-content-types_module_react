import React, { FC } from 'react';

import { StatusIconProps } from './StatusIcon.types';

const StatusIcon: FC<StatusIconProps> = ({ active }) => {
	return (
		<div className="u-text-center">
			{active ? (
				<span className="u-text-success fa fa-check" />
			) : (
				<span className="u-text-danger fa fa-close" />
			)}
		</div>
	);
};

export default StatusIcon;
