import React, { FC } from 'react';

import Status from '../Status/Status';

import { SiteStatusProps } from './SiteStatus.types';

const SiteStatus: FC<SiteStatusProps> = ({ active = false }) => {
	return (
		<>
			{active ? (
				<Status label="Actief" type="ACTIVE" />
			) : (
				<Status label="Niet actief" type="INACTIVE" />
			)}
		</>
	);
};

export default SiteStatus;
